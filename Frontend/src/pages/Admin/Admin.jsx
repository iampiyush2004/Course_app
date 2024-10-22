import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Admin({
  name = "John Doe",
  photoUrl = "https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  totalCourses = 45,
  totalUsers = 12,
  bestSelling = "AI"
}) {
  // const token = localStorage.getItem('token');  // Retrieve the token from localStorage

  // useEffect(() => {
  //   fetch('/courses', {
  //     method: 'GET',
  //     headers: {
  //       'Authorization': `Bearer ${token}`,
  //       'Content-Type': 'application/json'
  //     }
  //   })
  //   .then(response => {
  //     console.log('Response:', response);
  //     return response.json();  // Only attempt to parse if the response is OK
  //   })
  //   .then(data => {
  //     console.log('Courses:', data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // }, [token]);
  
  return (
    <div className='mt-16 flex  justify-center '>
      <div className="flex bg-white shadow-2xl rounded-lg overflow-hidden w-[60vw] h-[70vh] transform transition-transform duration-300 hover:scale-105">
        <div className="w-1/3 p-4">
          <img 
            src={photoUrl} 
            alt={name} 
            className="w-full h-full object-cover rounded-lg shadow-md" 
          />
        </div>
        <div className="w-2/3 p-6">
          <p className="text-gray-600 mt-2 text-xl">Welcome</p>
          <h2 className="text-5xl font-bold text-gray-800">{name}</h2>
          <div className='mt-4'>
            <p className='text-2xl text-red-500 font-semibold'>Statistics</p>
            <div className='flex flex-col bg-gray-50 w-[60%] p-6 rounded-2xl shadow-inner mt-2'>
              <div className='flex justify-between text-gray-700 py-2'>
                <div>Total Courses Uploaded:</div>
                <div>{totalCourses}</div>
              </div>
              <div className='flex justify-between text-gray-700 py-2'>
                <div>Total Users Enrolled:</div>
                <div>{totalUsers}</div>
              </div>
              <div className='flex justify-between text-gray-700 py-2'>
                <div>Best Selling Course:</div>
                <div>{bestSelling}</div>
              </div>
            </div>
          </div>
          <div className='flex justify-around mt-8 gap-3'>
            <Link to="/editProfile" className="bg-blue-600 text-center w-[60%] text-white px-5 py-2 rounded-lg shadow transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Edit Your Profile
            </Link>
            <Link to="/AddCourse" className="bg-blue-600 text-center w-[60%] text-white px-5 py-2 rounded-lg shadow transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Add More Course
            </Link>
            <Link to="/editCourse" className="bg-blue-600 text-center w-[60%] text-white px-5 py-2 rounded-lg shadow transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
            Edit Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
