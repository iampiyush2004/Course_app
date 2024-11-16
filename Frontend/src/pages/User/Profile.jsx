import React, { useContext, useEffect, useRef, useState } from 'react'
import { Context } from "../../Context/Context"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

function Profile() {
  const [data, setData] = useState(null)
  const { checkStudent,changeNotificationData } = useContext(Context)
  const [reviews, setReviews] = useState(null)
  const [newAvatar, setNewAvatar] = useState(null)  // Track the new avatar
  const imgRef = useRef()
  const navigate = useNavigate()
  const [lastWatched,setLastWatched] = useState()

  // Load user data from localStorage
  useEffect(() => {
    const localData = localStorage.getItem("user")
    if (localData) {
      setData(JSON.parse(localData))
    } else {
      checkStudent()
    }
  }, [checkStudent])

  // Fetch reviews
  useEffect(() => {
    const retrieveReview = async () => {
      try {
        const response = await axios.get("http://localhost:3000/review/reviewStudent", { withCredentials: true })
        if (response.status === 200) {
          setReviews(response.data.reviews)
        }
      } catch (err) {
        console.error('Error fetching reviews:', err)
      }
    }

    retrieveReview()
  }, [])

  const handleImageChange = async(event) => {
    changeNotificationData("Avatar Uploading!!!")
    const file = event.target.files[0]
    if (file) {
      const uplImg = new FormData()
      uplImg.append("avatar",file)
      try {
      const response = await axios.put("http://localhost:3000/user/updateAvatar",
        uplImg,
        {
          withCredentials : true
        }
      )
      if(response.status===200){
        checkStudent()
        changeNotificationData("Avatar Uploaded Successfully!!!")
      }else console.log("Error in updating avatar")
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(()=>{
    const fetchLastWatched = async() => {
      try {
        const response = await axios.get("http://localhost:3000/user/lastWatched",{
          withCredentials:true
        })
        if(response.status===200){
          setLastWatched(response.data.lastWatched)
        }
        else{
          console.log("error in fetching data")
        }
      } catch (error) {
        console.error("error in fetchong last watched ",error)
      }
    }
    fetchLastWatched()
  },[])

  return (
    <div className='min-h-screen mb-20 p-4'>
      <div className='bg-green-100 p-5 rounded-md shadow-md flex justify-between gap-x-5'>
        {/* Left side */}
        <div className="w-2/3 p-6 flex flex-col gap-y-20 pr-10">
          {/* Main/top part */}
          <div className='flex space-x-16'>
            <div className="relative flex flex-col items-center w-1/2">
              <img
                src={data?.avatar}
                alt={data?.name}
                className="h-[40vh] w-full rounded-full object-cover border-4 border-black my-auto"
              />
              <input
                type="file"
                ref={imgRef}
                accept="image/*"
                className="absolute top-2 left-2 opacity-0 cursor-pointer"
                onChange={handleImageChange}
              />
              <div className='flex gap-x-3'>
                <button
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all mt-4"
                  onClick={() => imgRef.current.click()}
                >
                  Edit Avatar
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-all mt-4"
                  onClick={() => navigate("/user/editProfile")}
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* User Info & Resume Learning */}
            <div className="flex flex-col w-full items-center gap-y-4">
              {/* Name Section */}
              <div className="bg-green-50 w-full flex flex-col p-4 rounded-3xl h-1/2">
                <div className="text-3xl text-gray-600">Welcome,</div>
                <div className="text-6xl font-bold text-gray-900 mb-2">{data?.name}</div>
                <div className="text-xl text-gray-500">@ {data?.username}</div>
              </div>

              {/* Resume Learning Section */}
              {lastWatched && <div className="bg-green-50 w-full flex flex-col p-4 rounded-3xl gap-y-4 h-1/2">
                <div className="flex items-center gap-x-6 border border-gray-100 p-1 rounded-lg">
                  <img
                    src={lastWatched.imageLink}
                    alt={"course_name"}
                    className="w-1/3 h-28 rounded-xl"
                  />
                  <div>
                    <div className='font-medium'>{lastWatched.title}</div>
                    <div>{lastWatched.description}</div>
                  </div>
                </div>
                <button className="bg-blue-400 py-2 px-6 rounded-lg flex items-center gap-x-2 justify-center" onClick={()=>navigate(`/courses/${lastWatched._id}/videos/132`)}>
                  Resume Learning
                  <span className="text-2xl">&#8594;</span>
                </button>
              </div>}
            </div>
          </div>

          {/* Personal Info/2 part */}
          <div className="bg-green-50 p-6 w-full max-w-3xl mx-auto rounded-3xl shadow-lg">
            <div className="text-2xl font-semibold text-gray-800 mb-4">Personal Information</div>
            <div className="space-y-4">
              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-medium">Gender:</span>
                <span className="text-gray-900">{data?.gender.toUpperCase()}</span>
              </div>

              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-medium">Email:</span>
                <span className="text-gray-900">{data?.email}</span>
              </div>

              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-medium">Institution:</span>
                <span className="text-gray-900">{data?.institution.toUpperCase()}</span>
              </div>

              <div className="flex justify-between text-lg text-gray-700">
                <span className="font-medium">DOB:</span>
                <span className="text-gray-900">{data?.dob}</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className='w-full p-6 bg-green-50'>
            <div className='text-3xl font-bold text-gray-800 mb-6'>
              Your Recent Reviews
            </div>
            {reviews && reviews.length > 0 ? (
              reviews.slice(0, Math.min(4, reviews.length)).map((review, index) => (
                <div
                  key={index}
                  className='border border-gray-200 bg-green-50 rounded-lg shadow-lg p-6 flex flex-col gap-1 max-w-3xl mx-auto mb-2'
                >
                  <div className='flex gap-4 items-center'>
                    <img
                      src={data?.avatar}
                      alt={data?.name || "User Avatar"}
                      className='w-14 h-14 rounded-full object-cover'
                    />
                    <div className='flex flex-col'>
                      <div className='text-xl font-semibold text-gray-800'>
                        {data?.name || 'Anonymous'}
                      </div>
                      <div className='text-sm text-gray-500 cursor-pointer' onClick={() => navigate(`/courses/${review.courseId._id}`)}>
                        {review?.courseId?.title || 'Course Name'} <span className="text-1xl">&#8594;</span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-2'>
                    <div className='text-lg font-semibold text-gray-800'>{review?.user}</div>
                    <p className='text-gray-600 text-base mt-1'>{review?.comment}</p>
                  </div>

                  <div>
                    <div className='text-yellow-500 text-lg'>
                      {'★'.repeat(review?.stars)}
                      {'☆'.repeat(5 - review?.stars)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center text-gray-600'>
                You have no recent reviews yet.
              </div>
            )}
          </div>

        </div>

        {/* Right side */}
        <div className="flex flex-col bg-green-50 w-1/3 h-[80vh] rounded-xl fixed right-9 top-28 p-6 shadow-lg">
          <button className="bg-blue-500 py-2 px-6 rounded-lg flex items-center gap-x-2 justify-center text-white w-1/2 mb-2" onClick={() => navigate("/user/courses")}>
            View Your All Courses
            <span className="text-2xl">&#8594;</span>
          </button>

          <div className="text-2xl font-semibold text-gray-800 mb-4">Recently Purchased Courses</div>

          {
            data && data.coursePurchased.length > 0 && data.coursePurchased.slice(0, Math.min(3, data.coursePurchased.length)).map((course) => (
              <div key={course._id} className="flex bg-white rounded-lg shadow-md mb-4 p-2 hover:shadow-xl transition-all gap-x-2 cursor-pointer" onClick={() => navigate(`/courses/${course._id}/videos/132`)}>
                <img
                  src={course?.imageLink}
                  alt="Course Name"
                  className="w-1/2 h-28 rounded-lg object-cover"
                />
                <div className='w-1/2 flex flex-col gap-y-2'>
                  <div className="text-xl font-normal text-gray-900">{course?.title}</div>
                  <div className="text-gray-600 text-sm mt-2">{course?.description}</div>
                </div>
              </div>
            ))
          }
        </div>

      </div>
    </div>
  )
}

export default Profile
