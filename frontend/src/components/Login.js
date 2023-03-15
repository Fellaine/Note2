import {useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = ()=>{
    const url = process.env.REACT_APP_HOST_IP_ADDRESS
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    let navigate = useNavigate(); 
    const redirectToHome = () =>{ 
      let path = `/`; 
      navigate(path);
    }
    const redirectToRegister = () =>{ 
      let path = `/register`; 
      navigate(path);
    }
    const redirectToForgotPassword = () =>{ 
      let path = `/forgot-password`; 
      navigate(path);
    }
    const getToken = async (event) =>{
      event.preventDefault();
      const request = new Request(
        `${url}/accounts/obtain-token/`,
        {
          body:JSON.stringify({username: login,password: password}),
          headers:{
            'Content-Type': 'Application/Json'
          },
          method:'POST'
        }
      )
      const response = await fetch(request)
      const data = await response.json()
      if (response.ok){
        localStorage.setItem('token',data.access) // for drf jwt
        // localStorage.setItem('token',data.token) // for default drf tokens
        redirectToHome()
      }
      else console.log("Error while making request")
      // response.ok?console.log(data.token):console.log("Error while making request")
    }
    return(
        <div className="form">
          <div className="form-header">
            <div>
              <p className="form-title">Login</p>
            </div>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="login" className="form-label">Login</label>
              <input type="text" name="login" className="form-input" value={login}
                onChange={(e)=>setLogin(e.target.value)} required/>
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" name="password" className="form-input" value = {password}
                onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!password||!login} className="form-btn" onClick={getToken}>Log in</button>
            </div>
            <div className="redirect">
              <p>Forgot your <span className='redirect-span' onClick={redirectToForgotPassword}>password?</span></p>
            </div>
            <div className="redirect">
              <p>Don't have an account? <span className='redirect-span' onClick={redirectToRegister}>Register</span></p>
            </div>
          </form>
        </div>
    )
}
export {Login}