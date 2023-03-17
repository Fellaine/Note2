import {useSearchParams, useNavigate} from 'react-router-dom'
import {useEffect} from'react'
import {NotificationManager} from 'react-notifications';


const VerifyUser =()=>{
    const url = process.env.REACT_APP_HOST_IP_ADDRESS
    const [searchParams, setSearchParams] = useSearchParams();
    const userId = searchParams.get("user_id")
    const timestamp = searchParams.get("timestamp")
    const signature = searchParams.get("signature")
    var message = "Verifiing..."

    let navigate = useNavigate(); 
    const routeChange = () =>{ 
      let path = `/login`; 
      navigate(path);
    }
    const verify = async (event) =>{
      const request = new Request(
        `${url}/accounts/verify-registration/`,
        {
          body:JSON.stringify({user_id: userId, timestamp: timestamp, signature: signature}),
          headers:{
            'Content-Type': 'Application/Json',
          },
          method:'POST'
        }
      )
      const response = await fetch(request)
      const data = await response.json()
      response.ok?routeChange():message="Error while verifying registration"
      if (response.ok){
        NotificationManager.success('Email verified successfully');
        routeChange()
      }
      else{
        NotificationManager.error(Object.values(data))
        routeChange()
        // Object.keys(data.non_field_errors).length !== 0&&NotificationManager.error(data.non_field_errors)
        // Object.keys(data.password).length !== 0&&NotificationManager.error(data.password)
      } 
      // response.ok?console.log(data):console.log("Error while making request")
      // !response.ok && console.log("Error while making request")
      // console.log(title)
      // console.log(content)
    }
    useEffect(()=>{
      verify();
  
      },[]
    )
    return(
        <div>
          <p className="verify-message">{message}</p>
        </div>
    )
}
export {VerifyUser}