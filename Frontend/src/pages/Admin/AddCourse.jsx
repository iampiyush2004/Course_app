import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AddCourse() {
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [imageLink,setImageLink] = useState("")
  const [price,setPrice] = useState(0)
  const [message,setMessage] = useState()
  let data = {title,description,imageLink,price}

  const token = localStorage.getItem('token');
  const clearForm = () => {
    setTitle("")
    setDescription("")
    setImageLink("")
    setPrice(0)
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/admin/createCourse", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        clearForm()
        setMessage("Course Created Successfully!!!")
        // console.log()
      } else {
        console.log("Error!!!")
      }
    } catch (error) {
      console.log("Error")
    }
  }

  return (
    <div className='h-screen'>
      <div className='flex items-center justify-center mt-8'>
        <div className='bg-white p-8 rounded-lg shadow-md  w-1/2'>
          <div className="mb-8 flex items-center gap-8">
            <Link to="/adminName" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
            &larr; Back
            </Link>
            <h2 className='text-2xl font-bold text-center'>Add New Course</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Enter Course Name'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
            <input
              type='text'
              placeholder='Enter Description'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />
            <input
              type='text'
              placeholder='Enter Course Image Link'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              value={imageLink}
              onChange={(e)=>setImageLink(e.target.value)}
            />
            <input
              type='number'
              placeholder='Enter Price'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
            />
            <input
              type='submit'
              value='Add Course'
              className='bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition duration-200 w-full'
            />
            {message && <div className="mt-4 text-center text-blue-600">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
