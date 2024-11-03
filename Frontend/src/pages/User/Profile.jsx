import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Profile() {
  const navigate = useNavigate()
  const handleLogout = async() => {
    try {
      const response = await axios.post("http://localhost:3000/user/logout",{},{
        withCredentials : true
      })
      if(response.status===200){
        navigate("/")
        localStorage.clear()
        
      }
      else {
        console.log("Error")
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <div className=' h-screen'>
        <div className='text-5xl font-bold text-center'>
          Student Profile
        </div>
        <button onClick={handleLogout} className='text-black text-2xl ml-80'>Log Out</button>
      </div>
    </>
  )
}

export default Profile