import {useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {NotificationManager} from 'react-notifications';


const ResetPassword = ()=>{
    const url = process.env.REACT_APP_HOST_IP_ADDRESS
    const [searchParams, setSearchParams] = useSearchParams();
    const userId = searchParams.get("user_id")
    const timestamp = searchParams.get("timestamp")
    const signature = searchParams.get("signature")
    const [password, setPassword] = useState('')
    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/login`; 
      navigate(path);
    }
    const resetPassword = async (event) =>{
      event.preventDefault();
      const request = new Request(
        `${url}/accounts/reset-password/`,
        {
          body:JSON.stringify({password: password, user_id: userId, timestamp: timestamp, signature: signature}),
          headers:{
            'Content-Type': 'Application/Json'
          },
          method:'POST'
        }
      )
      const response = await fetch(request)
      const data = await response.json()
      if (response.ok){
        NotificationManager.success('Password reset successfully');
        routeChange()
      }
      else{
        NotificationManager.error(Object.values(data))
      }
      // response.ok?console.log(data.token):console.log("Error while making request")
    }
    return(
        <div className="form">
          <div className="form-header">
            <div>
              <p className="form-title">Reset password</p>
            </div>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Enter your new password</label>
              <input type="password" name="password" className="form-input" value = {password}
                onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="form-group">
              <button type="submit" disabled={!password} className="form-btn" onClick={resetPassword}>Submit</button>
            </div>
            <div className="redirect">
              <p>Already have an account? <span className='redirect-span' onClick={routeChange}>Login</span></p>
            </div>
          </form>
        </div>
    )
}
export {ResetPassword}