import datetime
from urllib.parse import parse_qs, urlparse

from django.conf import settings
from django.contrib.auth.models import User
from django.core import mail
from django.test import Client, TestCase

from .models import Note


class SettingsTestCase(TestCase):
    def test_settings(self):
        self.assertFalse(settings.DEBUG)


class UserTestCase(TestCase):
    def setUp(self):
        self.user_1 = User.objects.create_user(
            "John Doe", "johndoe@example.com", "password"
        )

    def test_user_pw(self):
        self.assertTrue(self.user_1.check_password("password"))
        self.assertEqual(self.user_1.email, "johndoe@example.com")


class NoteTestCase(TestCase):
    def setUp(self):
        self.user_1 = User.objects.create_user(
            "John Doe", "johndoe@example.com", "password"
        )
        self.user_2 = User.objects.create_user(
            "John Doe2", "johndoe2@example.com", "password"
        )
        self.note_1 = Note.objects.create(
            title="Test Note 1 title",
            content="Test Note 1 content",
            last_edited=datetime.date.today(),
            user=self.user_1,
        )
        self.note_2 = Note.objects.create(
            title="Test Note 2 title",
            content="Test Note 2 content",
            last_edited=datetime.date.today(),
            user=self.user_1,
        )
        self.note_3 = Note.objects.create(
            title="Test Note 3 title",
            content="Test Note 3 content",
            last_edited=datetime.date.today(),
            user=self.user_2,
        )

    def test_note_creation(self):
        self.assertEqual(self.note_1.title, "Test Note 1 title")
        self.assertEqual(self.note_1.content, "Test Note 1 content")
        self.assertEqual(self.note_3.content, "Test Note 3 content")
        self.assertEqual(self.note_1.user, self.user_1)
        self.assertEqual(self.note_3.user, self.user_2)

    def test_note_count(self):
        self.assertEqual(Note.objects.all().count(), 3)
        self.assertEqual(Note.objects.filter(user=self.user_1).count(), 2)


class RegisterAndCrudTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.c = Client()
        cls.response = cls.c.post(
            "/accounts/register/",
            {
                "username": "test",
                "email": "test@test.com",
                "password": "Verysecurepas123",
                "password_confirm": "Verysecurepas123",
            },
        )
        cls.my_mail = mail.outbox
        return super().setUpTestData()

    def test_registration_201(self):
        self.assertEqual(self.response.status_code, 201)

    def test_register_email_sent(self):
        self.assertEqual(len(self.my_mail), 1)

    def test_register_email_title(self):
        self.assertEqual(
            self.my_mail[0].subject,
            "Please verify your account",
        )

    def test_register_email_body(self):
        msg, url = self.my_mail[0].body.split("\n", 1)
        self.assertEqual(msg, "Please verify your account by clicking on this link:")

    def test_crud_with_access_token(self):
        _, url = self.my_mail[0].body.split("\n", 1)
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        user_id, timestamp, signature = (
            query_params["user_id"],
            query_params["timestamp"],
            query_params["signature"],
        )
        verify_registration_response = self.c.post(
            "/accounts/verify-registration/",
            {
                "user_id": user_id,
                "timestamp": timestamp,
                "signature": signature,
            },
        )
        self.assertEqual(verify_registration_response.status_code, 200)
        obtain_token_of_registrated_user_response = self.c.post(
            "/accounts/obtain-token/",
            {
                "username": "test",
                "password": "Verysecurepas123",
            },
        )
        self.assertEqual(obtain_token_of_registrated_user_response.status_code, 200)
        access_token = obtain_token_of_registrated_user_response.json()["access"]
        self.assertTrue(access_token)
        get_notes_response = self.c.get(
            "/api/notes/", **{"HTTP_AUTHORIZATION": "Bearer " + access_token}
        )
        """
        Method currently recommended by docs will not work here since it was only added in 4.2:
        headers={"Authorization": f"Bearer {access_token}"}
        and while doing it using **extra one should change Authorization to HTTP_AUTHORIZATION
        as explained here: https://stackoverflow.com/questions/54674844/
        """
        self.assertEqual(get_notes_response.status_code, 200)
        self.assertEqual(get_notes_response.json(), [])
        create_note_response = self.c.post(
            "/api/notes/",
            {
                "title": "title 1",
                "content": "content 1",
            },
            **{"HTTP_AUTHORIZATION": "Bearer " + access_token},
        )
        self.assertEqual(create_note_response.status_code, 201)
        get_notes_response2 = self.c.get(
            "/api/notes/", **{"HTTP_AUTHORIZATION": "Bearer " + access_token}
        )
        self.assertEqual(len(get_notes_response2.json()), 1)
        self.assertEqual(get_notes_response2.json()[0]["title"], "title 1")
        self.assertEqual(get_notes_response2.json()[0]["content"], "content 1")
        get_note_by_id_response = self.c.get(
            f"/api/notes/{create_note_response.json()['id']}/",
            **{"HTTP_AUTHORIZATION": "Bearer " + access_token},
        )
        self.assertEqual(get_note_by_id_response.status_code, 200)
        self.assertEqual(get_note_by_id_response.json()["title"], "title 1")
        self.assertEqual(get_note_by_id_response.json()["content"], "content 1")
        put_note_response = self.c.put(
            f"/api/notes/{create_note_response.json()['id']}/",
            {
                "title": "title 1 was changed by put",
                "content": "content 1 was changed by put",
            },
            **{
                "HTTP_AUTHORIZATION": "Bearer " + access_token,
            },
            content_type="application/json",
        )
        self.assertEqual(put_note_response.status_code, 200)
        self.assertEqual(
            put_note_response.json()["title"], "title 1 was changed by put"
        )
        self.assertEqual(
            put_note_response.json()["content"], "content 1 was changed by put"
        )
        delete_note_response = self.c.delete(
            f"/api/notes/{create_note_response.json()['id']}/",
            **{
                "HTTP_AUTHORIZATION": "Bearer " + access_token,
            },
            content_type="application/json",
        )
        self.assertEqual(delete_note_response.status_code, 204)
        get_note_by_id_response2 = self.c.get(
            f"/api/notes/{create_note_response.json()['id']}/",
            **{"HTTP_AUTHORIZATION": "Bearer " + access_token},
        )
        self.assertEqual(get_note_by_id_response2.status_code, 404)
