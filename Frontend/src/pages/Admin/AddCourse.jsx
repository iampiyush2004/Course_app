import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import axios from 'axios';
import Loading from "../../components/Loading"
import ConfirmationDialog from '../../components/ConfirmationDialog';

function AddCourse() {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [imageLink, setImageLink] = useState(null);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading,setIsLoading] = useState(false)
  const { dataFetcher, changeNotificationData, isLoggedIn } = useContext(Context);
  const [isOpen,setIsOpen] = useState(false)
  const [courseId,setCourseId] = useState(null)

  const clearForm = () => {
    setTitle("");
    setShortDescription("");
    setDetailedDescription("");
    setImageLink(null);
    setPrice(0);
  };

  useEffect(() => {
    setMessage('');
  }, [title, shortDescription, detailedDescription, imageLink, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !shortDescription || !detailedDescription || !imageLink || !price) {
      setMessage("All fields are required.");
      return;
    }

    const charCount = shortDescription.length;
    if (charCount > 150) {
      setMessage("Short description cannot exceed 150 characters.");
      return;
    }
    setIsLoading(true)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("shortDescription", shortDescription);
    formData.append("detailedDescription", detailedDescription);
    formData.append("imageLink", imageLink);
    formData.append("price", price);

    try {
      const response = await axios.post("http://localhost:3000/admin/createCourse", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        clearForm();
        dataFetcher();
        setCourseId(response.data.courseId)
        setIsOpen(true)
      } else {
        setMessage(response.data.message);
        console.log("Error!!!");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.");
      console.log("Error", error);
    } finally{
      setIsLoading(false)
    }
  };

  const handleShortDescriptionChange = (e) => {
    const { value } = e.target;
    const charCount = value.length;

    if (charCount <= 150) {
      setShortDescription(value);
    }
  };

  const onClose = () => {
    navigate("/adminName")
    changeNotificationData("Course Created Successfully!!!");
    setIsOpen(false)
  }

  const onConfirm = () => {
    navigate(`/adminName/${courseId}/add-video`)
    changeNotificationData("Course Created Successfully!!!");
    setIsOpen(false)
  }

  useEffect(()=>{
    if(isLoggedIn===false) navigate("/admin")
  },[isLoggedIn])
  
  return (
    <div>
      {
        isLoading?(
          <Loading/>
        ):(
          <div className='h-screen mb-28'>
            <div className='flex items-center justify-center mt-8'>
              <div className='bg-white p-8 rounded-lg shadow-md w-1/2 min-h-[60vh] flex flex-col gap-x-60'>
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
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="mb-2">
                    <textarea
                      placeholder='Enter Short Description (up to 150 characters)'
                      className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full  min-h-24 resize-none'
                      value={shortDescription}
                      onChange={handleShortDescriptionChange}
                      maxLength={150} 
                    />
                    <div className='text-right text-gray-500'>
                      {shortDescription.length}/150 characters
                    </div>
                  </div>
                  <textarea
                    placeholder='Enter Detailed Description'
                    className='border border-gray-300 p-3 mb-2 min-h-28 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                    value={detailedDescription}
                    onChange={(e) => setDetailedDescription(e.target.value)}
                  />
                  <div className="mb-1">
                    <label className="block text-gray-700 font-semibold mb-2">Thumbnail</label>
                    <input
                      type='file'
                      accept='image/*'
                      className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full mb-4'
                      onChange={(e) => setImageLink(e.target.files[0])}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Price</label>
                    <input
                      type='number'
                      placeholder='Enter Price'
                      className='border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
                      value={price}
                      min={0}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <input
                    type='submit'
                    value='Add Course'
                    className='bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition duration-200 w-full'
                  />
                  {message && <div className="mt-4 text-center text-blue-600">{message}</div>}
                </form>
              </div>
              <ConfirmationDialog
                isOpen={isOpen}
                onClose={()=>onClose()}
                onConfirm={()=>onConfirm()}
                title="Would you like to upload videos now?"
                message="You can also upload videos later if you'd prefer."
                // option1 = "Ye"
                // option2 = "I will do it later"
                />
            </div>
          </div>
        )
      }
    </div>
  );
}

export default AddCourse;
