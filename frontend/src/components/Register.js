import {useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ()=>{
    const url = process.env.REACT_APP_HOST_IP_ADDRESS
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/login`; 
      navigate(path);
    }
    const register = async (event) =>{
      event.preventDefault();
      const request = new Request(
        `http://${url}:8000/accounts/register/`,
        {
          body:JSON.stringify({username: login, email: email, password: password, password_confirm: confirmPassword}),
          headers:{
            'Content-Type': 'Application/Json'
          },
          method:'POST'
        }
      )
      const response = await fetch(request)
      const data = await response.json()
      if (response.ok){
        routeChange()
      }
      else console.log("Error while making request")
      // response.ok?console.log(data.token):console.log("Error while making request")
    }
    return(
        <div className="form">
          <div className="form-header">
            <div>
              <p className="form-title">Register</p>
            </div>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="login" className="form-label">Login</label>
              <input type="text" name="login" className="form-input" value={login}
                onChange={(e)=>setLogin(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" name="email" className="form-input" value={email}
                onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" name="password" className="form-input" value = {password}
                onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">Confirm password</label>
              <input type="password" name="confirm-password" className="form-input" value = {confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)} required/>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!password||!login||!confirmPassword} className="form-btn" onClick={register}>Register</button>
            </div>
            <div className="redirect">
              <p>Already have an account? <span className='redirect-span' onClick={routeChange}>Login</span></p>
            </div>
          </form>
        </div>
    )
}
export {Register}