import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../components/Loading'

function TeacherInfo() {
  const {teacher_id} = useParams()
  const [data,setData] = useState(null) 
  const [loading,setLaoding] = useState(false)
  useEffect(()=>{
    const fetchTeacherInfo = async() => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/${teacher_id}`,{
          withCredentials : true
        })
        if(response.status===200){  
          setData(response.data)
        } else{
          console.log("Error in fetching teacher Info")
        }
      } catch (error) {
        console.error("Error in fetching teacher Info",error)
      } finally{
        setLaoding(false)
      }
    }
    fetchTeacherInfo()
  },[])
  
  return (
    <div>
      {
        loading?(
          <Loading/>
        ):(
          <div className='p-10'>
            {/* top part */}
            <div className="flex items-center space-x-4 p-4 bg-green-100 rounded-lg shadow-md justify-start gap-x-20">
              <img src={data?.avatar} alt={data?.username} className="w-1/5 h-[40vh] rounded-full object-cover border-2 border-gray-300" />
              <div className="flex flex-col justify-around gap-y-10">
                <div>
                  <div className="text-6xl font-bold text-gray-800">{data?.name}</div>
                  <div className="text-3xl text-gray-500">@{data?.username}</div>
                </div>
                <div className="flex justify-around border border-gray-300 p-8 bg-gray-50 rounded-lg shadow-md gap-x-32">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-700">Total Courses Uploaded</div>
                    <div className="text-2xl font-bold text-gray-800">{data?.createdCourses.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-700">Total Users Enrolled</div>
                    <div className="text-2xl font-bold text-gray-800">1,246</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-700">Best-Selling Course</div>
                    <div className="text-2xl font-bold text-gray-800">AI</div>
                  </div>
                </div>

              </div>
            </div>

            {/* second part */}
            <div>
              
              {data?.bio}
            </div>
          </div>
        )
      }
    </div>
  )
}

export default TeacherInfo