import './App.css';
import { useEffect, useState } from 'react';
import { Note } from './components/Note';
import { Form } from './components/Form';
import { useNavigate } from 'react-router-dom';
// import jsonwebtoken
import jwt_decode from "jwt-decode";


function App() {
  const backend_url = process.env.REACT_APP_HOST_IP_ADDRESS
  let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/login`; 
      navigate(path);
    }
  
  try {
    var token = localStorage.getItem("token");
    var decodedJWTToken = jwt_decode(token)
  } catch (error) {
    routeChange()
  }
  
  // const decodedJWTToken = jwt_decode(token);
  const dateNow = new Date();
  const [formVisible, setFormVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [notes, setNotes] = useState([])
  const [updateNoteCheck, setUpdateNoteCheck] = useState([false])
  // const [testHl, setTestHl] = useState('Howdy')


  const createNote = async (event) =>{
    event.preventDefault();

    const request = new Request(
      `http://${backend_url}:8000/api/notes/`,
      {
        body:JSON.stringify({title,content}),
        headers:{
          'Content-Type': 'Application/Json',
          "Authorization": `Bearer ${token}`
        },
        method:'POST'
      }
    )
    const response = await fetch(request)
    const data = await response.json()
    // response.ok?console.log(data):console.log("Error while making request")
    !response.ok && console.log("Error while making request")
    // console.log(title)
    // console.log(content)
    setFormVisible(!formVisible)
    setTitle('')
    setContent('')
    getNotes()
  }
  const updateNote = async (event, id) =>{
    // console.log(id)
    // console.log(id)
    event.preventDefault();
    const url = `http://${backend_url}:8000/api/notes/${id}/`
    // console.log(url)
    // console.log(url)

    const request = new Request(
      url,
      {
        body:JSON.stringify({title,content}),
        headers:{
          'Content-Type': 'Application/Json',
          "Authorization": `Bearer ${token}`
        },
        method:'PUT'
      }
    )
    const response = await fetch(request)
    const data = await response.json()
    // response.ok?console.log(data):console.log("Error while making request")
    !response.ok && console.log("Error while making request")
    // console.log(title)
    // console.log(content)
    setFormVisible(!formVisible)
    setTitle('')
    setContent('')
    getNotes()
  }
  const getNotes = async () =>{
    const request = new Request(
      `http://${backend_url}:8000/api/notes/`,
      {
        headers:{
          "Authorization": `Bearer ${token}`
        },
        method:'GET'
      }
    )
    const response = await fetch(request)
    const data = await response.json()
    response.ok?setNotes(data):console.log("Error while making request")
  }
  useEffect(()=>{

    if(token){
      if(decodedJWTToken.exp < dateNow.getTime()/1000){
        // console.log("Token expired")
        // console.log(decodedToken.exp)
        // console.log(Math.round(dateNow.getTime()/1000))
  
        routeChange()
      }
      else{
        getNotes()
      }
    }
    else{
      //redirect to /login
      routeChange()
    }

    },[]
  )
  const deleteNote= async (noteId)=>{
    const response = await fetch(`http://${backend_url}:8000/api/notes/${noteId}/`,
    {
      headers:{
        "Authorization": `Bearer ${token}`
      },
      method:'DELETE'
    })
    // response.ok?console.log(response.status):console.log("Error while making request")
    !response.ok && console.log("Error while making request")
    getNotes()


    // console.log(noteId)
  }
  return (
    <div className="App">
      <div className="header">
        <div className="header-text">
          <p className="title">Notes</p>
        </div>
        <div className="add-note">
          <button className="add-btn" onClick={()=>{
            setUpdateNoteCheck([false]);
            setFormVisible(!formVisible);
            setTitle('');
            setContent('');
            }}>
            Add Note</button>
        </div>
        <div className="login">
          <button className="login-btn" onClick={
            // remove token from local storage and redirect to login page
            ()=>{
            localStorage.removeItem("token")
            routeChange()
            }
          }>Logout</button>
        </div>
      </div>
      <div className="notes">
        {
          notes.map((el)=>(
            <Note key={el.id} title={el.title} content={el.content} last_edited={el.last_edited}
            onclickNote={()=>{
              setUpdateNoteCheck([true,el.id]);
              setTitle(el.title);
              setContent(el.content);
              setFormVisible(!formVisible);
              }}
            onclickDel={()=>deleteNote(el.id)}/>
            )
          )
        }
      </div>
      <div className={formVisible?"modal":"modal-hidden"} onClick={()=>setFormVisible(!formVisible)}>
        {/* <div className="form">
          <div className="form-header">
            <div>
              <p className="form-title">Create Note</p>
            </div>
            <div>
              <button className="close-btn" onClick={()=>setFormVisible(!formVisible)}>X</button>
            </div>
          </div>
          <form action="">
            <div className="form-group">
              <label htmlFor="form-title" className="form-label">Title</label>
              <input type="text" name="form-title" className="form-input" value={title}
                onChange={(e)=>setTitle(e.target.value)}/>
            </div>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Content</label>
              <textarea type="text" name="title" className="form-input" rows={4} value = {content}
                onChange={(e)=>setContent(e.target.value)}/>
            </div>
            <div className="form-group">
              <button type="submit" className="form-btn" onClick={createNote}>Save</button>
            </div>
            <div className="test"></div>
          </form>
        </div> */}
        {/* <Form formVisible={formVisible} setFormVisible={setFormVisible} title={title} setTitle={setTitle} 
        content={content} setContent={setContent} formSubmitAction={createNote}/> */}
        <Form formVisible={formVisible} setFormVisible={setFormVisible} title={title} setTitle={setTitle} 
        content={content} setContent={setContent} updateNoteCheck={updateNoteCheck}
        formSubmitAction={updateNoteCheck[0]?(event)=>updateNote(event,updateNoteCheck[1]):createNote}/>
      </div>
    </div>
  );
}

export default App;
