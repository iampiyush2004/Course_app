// Other imports remain the same
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../../Context/Context';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import axios from 'axios';
import Loading from "../../components/Loading"
function EditInfo() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState(''); 
  const { dataFetcher, userData, changeNotificationData } = useContext(Context);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState();
  const [loading,setLoading] = useState(false)
  const handleRevert = () => {
    if (!userData) dataFetcher();
    else {
      setName(userData.name || ''); 
      setDob(userData.dob || ''); 
      setExperience(userData.experience || ''); 
      setCompany(userData.company || ''); 
      setBio(userData.bio || '');
      setGender(userData.gender || ''); 
    }
  };

  useEffect(() => {
    handleRevert();
  }, [userData]);

  useEffect(() => {
    setMessage('');
  }, [name, dob, company, experience, bio, gender]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !dob || !company || !experience || !bio || !gender) {
      setMessage('All fields are required.');
      return;
    }
    setIsDialogOpen(true); 
  };

  const handleCancel = () => {
    setIsDialogOpen(false); 
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true)
    const data = {name,dob,experience,company,bio,gender}

    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URI}/admin/editProfile`,data,{
        withCredentials : true
      })

      if (response.status === 200) {
        dataFetcher();
        changeNotificationData("User Profile Updated!!!");
        navigate("/adminName");
      } else {
        console.log("Error:", response.data.message || "Some error occurred");
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
    setIsDialogOpen(false);
  };

  return (
    <div>
      {
        loading?(
          <Loading/>
        ):(
          <div>
            <div className="w-full max-w-3xl mx-auto p-4 md:p-8 border border-gray-300 rounded-2xl shadow-xl bg-green-50 flex flex-col space-y-6">
              <div className="mb-2 flex flex-col sm:flex-row items-center gap-4">
                <Link to="/adminName" className="bg-gray-800 text-white py-2 px-6 text-lg rounded-xl transition-all transform hover:bg-gray-700 hover:scale-105 shadow-md">
                  &larr; Back
                </Link>
                <h2 className='text-3xl font-extrabold text-gray-800 text-center flex-1'>Edit Your Profile</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                
                {/* First Line: Name */}
                <div className='flex flex-col'>
                  <label htmlFor="name" className="font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Enter your name"
                    className="border border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Second Line: Date of Birth and Gender */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
                  <div className='flex flex-col w-full md:w-1/2'>
                    <label htmlFor="dob" className="font-bold text-gray-700 mb-1">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      className="border border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>

                  <div className='flex flex-col w-full md:w-1/2'>
                    <label className="font-bold text-gray-700 mb-1">Gender</label>
                    <div className="flex flex-wrap gap-4 p-1">
                      {['male', 'female', 'other'].map((g) => (
                        <label key={g} className="flex items-center cursor-pointer group">
                          <input
                            type="radio"
                            value={g}
                            checked={gender === g}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="capitalize text-gray-700 group-hover:text-blue-600 transition-colors">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Third Line: Experience and Company */}
                <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
                  <div className='flex flex-col w-full md:w-1/2'>
                    <label htmlFor="experience" className="font-bold text-gray-700 mb-1">Experience (Years)</label>
                    <input
                      id="experience"
                      type="number"
                      min={1}
                      max={150}
                      placeholder="Enter years of experience"
                      value={experience}
                      className="border border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                      onChange={(e) => setExperience(e.target.value)}
                      />
                  </div>

                  <div className='flex flex-col w-full md:w-1/2'>
                    <label htmlFor="company" className="font-bold text-gray-700 mb-1">Current Company</label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Enter your company"
                      value={company}
                      className="border border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all outline-none bg-white shadow-sm"
                      onChange={(e) => setCompany(e.target.value)}
                      />
                  </div>
                </div>

                {/* Last Line: Bio */}
                <div className='flex flex-col'>
                  <label htmlFor="bio" className="font-bold text-gray-700 mb-1">Professional Bio</label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself and your expertise..."
                    value={bio}
                    className="border border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 resize-y min-h-[120px] transition-all outline-none bg-white shadow-sm"
                    onChange={(e) => setBio(e.target.value)}
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <button type="button" className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-red-600 hover:shadow-lg transition-all active:scale-95 order-2 sm:order-1" onClick={handleRevert}>
                    Revert Changes
                  </button>
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all active:scale-95 order-1 sm:order-2">
                    Save Changes
                  </button>
                </div>

              </form>
              
              <ConfirmationDialog 
                isOpen={isDialogOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                title="Confirm Edit"
                message="Are you sure you want to update your profile information?"
              />
              {message && <div className="text-center font-semibold text-blue-600 animate-pulse">{message}</div>}
            </div>
          </div>
        )
      }
    </div>
  );
}

export default EditInfo;
