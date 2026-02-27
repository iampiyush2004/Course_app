import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import axios from 'axios';
import { AiOutlineEdit } from 'react-icons/ai';
import Loading from "../../components/Loading"
function Admin() {
  const [name, setName] = useState();
  const [photoUrl, setPhotoUrl] = useState("");
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalUsers, setTotalUsers] = useState(12);
  const [bestSelling, setBestSelling] = useState("AI");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { dataFetcher, changeNotificationData } = useContext(Context);
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for file input

  const fillInfo = () => {
    const savedUserData = localStorage.getItem('data');
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      setData(parsedData);
      setName(parsedData.name);
      setPhotoUrl(parsedData.avatar);
      setTotalCourses(parsedData.createdCourses.length);
    } else {
      dataFetcher();
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/admin/isLoggedin`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          if (response.data.isLoggedin === true) fillInfo();
          else navigate("/admin");
        } else {
          // Handle unexpected response
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        navigate("/admin");
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    fillInfo();
  }, [dataFetcher]);

  useEffect(() => {
    if (!data) setIsLoading(true);
    else setIsLoading(false);
  }, [data]);


  const handleEditClick = () => {
    fileInputRef.current.click(); // Trigger the file input
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      changeNotificationData("Uploading Your Avatar!!!")
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/admin/upload-image`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setPhotoUrl(URL.createObjectURL(file)); // Update photo URL with the new image
          dataFetcher()
          console.log('Profile photo uploaded successfully:', response.data);
          changeNotificationData("Avatar Uploaded Successfully!!!")
        } else {
          console.error('Error uploading photo:', response);
          changeNotificationData("Some Error Ocurred in uploading avatar!!!")
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
        changeNotificationData("Some Error Ocurred in uploading avatar!!!")
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <Loading/>
      ) : (
        <div className='mt-16 flex justify-center p-4'>
          <div className="flex flex-col md:flex-row bg-green-50 shadow-2xl rounded-lg overflow-hidden w-full max-w-5xl min-h-[70vh] transform transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto p-4">
              <img 
                src={photoUrl} 
                alt={name} 
                className="w-full h-full object-cover rounded-lg shadow-md" 
              />
              <button 
                onClick={handleEditClick} 
                className="absolute top-6 left-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                style={{ display: isLoading ? 'none' : 'block' }} // To prevent interaction while loading
              >
                <AiOutlineEdit className="text-gray-600" size={24} />
              </button>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} // Hide the file input
              />
            </div>

            <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-center gap-y-6">
              <div>
                <p className="text-gray-600 text-lg md:text-xl">Welcome</p>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 break-words">{name ? name : "John Doe"}</h2>
              </div>

              <div>
                <p className='text-xl md:text-2xl text-red-500 font-semibold mb-3'>Statistics</p>
                <div className='flex flex-col bg-green-100 w-full sm:w-[80%] md:w-[70%] p-6 rounded-2xl shadow-inner'>
                  <div className='flex justify-between text-gray-700 py-2 border-b border-green-200/50'>
                    <div className="font-medium">Total Courses:</div>
                    <div className="font-bold">{totalCourses}</div>
                  </div>
                  <div className='flex justify-between text-gray-700 py-2 border-b border-green-200/50'>
                    <div className="font-medium">Users Enrolled:</div>
                    <div className="font-bold">{totalUsers}</div>
                  </div>
                  <div className='flex justify-between text-gray-700 py-2'>
                    <div className="font-medium">Best Selling:</div>
                    <div className="font-bold">{bestSelling}</div>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
                <Link to="/adminName/editProfile"
                  className="bg-blue-600 text-center text-white px-4 py-3 rounded-xl shadow-md transition duration-200 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold">
                  Edit Profile
                </Link>
                <Link to="/adminName/AddCourse" className="bg-blue-600 text-center text-white px-4 py-3 rounded-xl shadow-md transition duration-200 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold">
                  Add Courses
                </Link>
                <Link to="/adminName/Courses"
                  className="bg-blue-600 text-center text-white px-4 py-3 rounded-xl shadow-md transition duration-200 hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 font-semibold"
                >
                  My Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
