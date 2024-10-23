import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/card';
import { Link } from 'react-router-dom';

const EditCourse = () => {
  const navigate  = useNavigate()
  const location = useLocation();
  const { val } = location.state || {};
  const [title, setTitle] = useState(val?.title || '');
  const [description, setDescription] = useState(val?.description || '');
  const [imageLink, setImageLink] = useState(val?.imageLink || '');
  const [price, setPrice] = useState(val?.price || '');
  const handleEditChange = () => {
    
  }
  const deleteCourse = async() => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:3000/admin/delete/${val._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        navigate("/adminName/Courses")
      } else {
        console.log("Error!!!")
      }
    } catch (error) {
      console.log("Error")
    }
    alert("hi") 
  }

  const revertChanges = () => {
    setTitle(val.title)
    setDescription(val.description)
    setPrice(val.price)
    setImageLink(val.imageLink)
  }
  return (
    <div className="flex items-center justify-center space-x-6 p-6 gap-x-20">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/adminName/Courses" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
          &larr; Back
          </Link>
          <h2 className='text-2xl font-bold text-center'>Add New Course</h2>
        </div>
        
        <label className="block mb-1 font-semibold">Course Name</label>
        <input
          type="text"
          placeholder="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
        />

        <label className="block mb-1 font-semibold">Image Link</label>
        <input
          type="text"
          placeholder="Image Link"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block mb-1 font-semibold">Course Price</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full max-w-md flex flex-col gap-y-4">
        <Card 
          key={val._id}
          title={title} 
          description={description} 
          imageLink={imageLink} 
          price={price} 
        />
        <button className="w-full py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200" onClick={revertChanges}>
          Revert Changes
        </button>
        <button className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">
          Save Changes
        </button>
        <button className="w-full py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200" onClick={deleteCourse}>
          Delete Course
        </button>
      </div>
    </div>
  );
};

export default EditCourse;
