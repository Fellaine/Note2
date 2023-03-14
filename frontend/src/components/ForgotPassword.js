import {useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ()=>{
    const url = process.env.REACT_APP_HOST_IP_ADDRESS
    const [email, setEmail] = useState('')
    let navigate = useNavigate(); 
    // const routeChange = () =>{ 
    //   let path = `/reset-password`; 
    //   navigate(path);
    // }
    const goToLogin = () =>{ 
      let path = `/login`; 
      navigate(path);
    }
    const forgotPassword = async (event) =>{
      event.preventDefault();
      const request = new Request(
        `http://${url}:8000/accounts/send-reset-password-link/`,
        {
          body:JSON.stringify({email: email}),
          headers:{
            'Content-Type': 'Application/Json'
          },
          method:'POST'
        }
      )
      const response = await fetch(request)
      const data = await response.json()
      if (response.ok){
        // routeChange()
        console.log("Follow instructions from the email")
      }
      else console.log("Error while making request")
      // response.ok?console.log(data.token):console.log("Error while making request")
    }
    return(
        <div className="form">
          <div className="form-header">
            <div>
              <p className="form-title">Forgot password?</p>
            </div>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Your email</label>
              <input type="email" name="email" className="form-input" value={email}
                onChange={(e)=>setEmail(e.target.value)} required/>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!email} className="form-btn" onClick={forgotPassword}>Submit</button>
            </div>
            <div className="redirect">
              <p>Go back to <span className='redirect-span' onClick={goToLogin}>Login</span></p>
            </div>
          </form>
        </div>
    )
}
export {ForgotPassword}