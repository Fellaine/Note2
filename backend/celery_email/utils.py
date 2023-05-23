from django.core.mail.message import EmailMultiAlternatives


def email_to_dict(email):
    email_dict = {
        "subject": email.subject,
        "from_email": email.from_email,
        "to": email.to,
        "cc": email.cc,
        "bcc": email.bcc,
        "reply_to": email.reply_to,
        "body": email.body,
        "alternatives": [],
        "attachments": [],
    }
    return email_dict


def dict_to_email(email_dict):
    subject = email_dict["subject"]
    from_email = email_dict["from_email"]
    to = email_dict["to"]
    cc = email_dict.get("cc", [])
    bcc = email_dict.get("bcc", [])
    reply_to = email_dict.get("reply_to", [])
    body = email_dict["body"]
    alternatives = []
    attachments = []

    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=from_email,
        to=to,
        cc=cc,
        bcc=bcc,
        reply_to=reply_to,
        # connection=connection,
        alternatives=alternatives,
        attachments=attachments,
    )

    return email
