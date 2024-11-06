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
        const response = await axios.get("http://localhost:3000/admin/isLoggedin", {
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
        const response = await axios.post("http://localhost:3000/admin/upload-image", formData, {
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
        <div className='mt-16 flex justify-center'>
          <div className="flex bg-green-50 shadow-2xl rounded-lg overflow-hidden w-[60vw] h-[75vh] transform transition-transform duration-300 hover:scale-105">
            <div className="relative w-1/3 p-4">
              <img 
                src={photoUrl} 
                alt={name} 
                className="w-full h-full object-cover rounded-lg shadow-md" 
              />
              <button 
                onClick={handleEditClick} 
                className="absolute top-2 left-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
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

            <div className="w-2/3 p-6 flex flex-col justify-center gap-y-[1%]">
              <div>
                <p className="text-gray-600 mt-2 text-xl">Welcome</p>
                <h2 className="text-5xl font-bold text-gray-800">{name ? name : "John Doe"}</h2>
              </div>

              <div className='mt-4'>
                <p className='text-2xl text-red-500 font-semibold'>Statistics</p>
                <div className='flex flex-col bg-green-100 w-[60%] p-6 rounded-2xl shadow-inner mt-2'>
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
                <Link to="/adminName/editProfile"
                  className="bg-blue-600 text-center w-[60%] text-white px-5 py-2 rounded-lg shadow transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Edit Your Profile
                </Link>
                <Link to="/adminName/AddCourse" className="bg-blue-600 text-center w-[60%] text-white px-5 py-2 rounded-lg shadow transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Add More Courses
                </Link>
                <Link to="/adminName/Courses"
                  className="bg-blue-600 text-center w-[60%] text-white px-5 py-2 rounded-lg shadow transition duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  All Your Courses
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
