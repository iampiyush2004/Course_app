import React, { useState } from 'react';

function AddCourse() {
  const [courseName,setCourseName] = useState()
  const [description,setDescription] = useState()
  const [image,setImage] = useState()
  const [price,setPrice] = useState()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(courseName)
    console.log(description)
    console.log(image)
    console.log(price)
  }
  return (
    <div className='h-screen'>
      <div className='flex items-center justify-center mt-8'>
        <div className='bg-white p-8 rounded-lg shadow-md  w-1/2'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Add New Course</h2>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Enter Course Name'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              onChange={(e)=>setCourseName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Enter Description'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              onChange={(e)=>setDescription(e.target.value)}
            />
            <input
              type='text'
              placeholder='Enter Course Image Link'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              onChange={(e)=>setImage(e.target.value)}
            />
            <input
              type='number'
              placeholder='Enter Price'
              className='border border-gray-300 p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
              onChange={(e)=>setPrice(e.target.value)}
            />
            <input
              type='submit'
              value='Add Course'
              className='bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition duration-200 w-full'
              
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
