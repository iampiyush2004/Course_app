// Other imports remain the same
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Context } from '../../Context/Context';
import ConfirmationDialog from '../../components/ConfirmationDialog';

function EditInfo() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState(''); 
  const [avatar, setAvatar] = useState(null); // Change initial state to null
  const { dataFetcher, userData, changeNotificationData } = useContext(Context);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState();
  let token = localStorage.getItem('token');

  const handleRevert = () => {
    if (!userData) dataFetcher(token);
    else {
      setName(userData.name || ''); 
      setAge(userData.age || ''); 
      setExperience(userData.experience || ''); 
      setCompany(userData.company || ''); 
      setBio(userData.bio || '');
      setGender(userData.gender || ''); 
      setAvatar(userData.avatar || null); // Change to null if no avatar
    }
  };

  useEffect(() => {
    handleRevert();
  }, [userData]);

  useEffect(() => {
    setMessage('');
  }, [name, age, company, experience, bio, avatar, gender]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !age || !company || !experience || !bio || !avatar || !gender) {
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
    const data = new FormData(); // Create a FormData object
    data.append('name', name);
    data.append('age', age);
    data.append('experience', experience);
    data.append('company', company);
    data.append('bio', bio);
    data.append('gender', gender);
    if (avatar) {
      data.append('avatar', avatar); // Append the file object
    }

    try {
      const response = await fetch("http://localhost:3000/admin/editProfile", {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data, 
      });

      if (response.ok) {
        dataFetcher(token);
        changeNotificationData("User Profile Updated!!!");
        navigate("/adminName");
      } else {
        const errorData = await response.json();
        console.log("Error:", errorData.message || "Some error occurred");
      }
    } catch (error) {
      console.log(error);
    } 
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="w-1/2 mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col space-y-4">
        <div className="mb-2 flex items-center gap-4">
          <Link to="/adminName" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
            &larr; Back
          </Link>
          <h2 className='text-2xl font-bold text-center'>Edit Your Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          
          {/* First Line: Name */}
          <div className='flex flex-col'>
            <label htmlFor="name" className="font-semibold text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              placeholder="Enter your name"
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Second Line: Date of Birth and Gender */}
          <div className='flex flex-row items-center gap-x-10'>
            <div className='flex flex-col'>
              <label htmlFor="age" className="font-semibold text-gray-700">Date of Birth</label>
              <input
                id="age"
                type="date"
                value={age}
                className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className='flex flex-col'>
              <label className="font-semibold text-gray-700">Gender</label>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    value="other"
                    checked={gender === 'other'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  Other
                </label>
              </div>
            </div>
          </div>

          {/* Third Line: Experience and Company */}
          <div className='flex flex-row items-center gap-x-10'>
            <div className='flex flex-col w-1/3'>
              <label htmlFor="experience" className="font-semibold text-gray-700">Experience</label>
              <input
                id="experience"
                type="number"
                min={1}
                max={150}
                placeholder="Enter your experience"
                value={experience}
                className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                onChange={(e) => setExperience(e.target.value)}
                />
            </div>

            <div className='flex flex-col w-1/3'>
              <label htmlFor="company" className="font-semibold text-gray-700">Previous/Current Company</label>
              <input
                id="company"
                type="text"
                placeholder="Enter your company"
                value={company}
                className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                onChange={(e) => setCompany(e.target.value)}
                />
            </div>
          </div>

          {/* Fourth Line: Avatar */}
          <div className='flex flex-col'>
            <label htmlFor="avatar" className="font-semibold text-gray-700">Avatar</label>
            <input
              id="avatar"
              type="file"
              accept="image/*" // Optional: restrict file type to images
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              onChange={(e) => setAvatar(e.target.files[0])} // Get the file object
            />
          </div>        

          {/* Last Line: Bio */}
          <div className='flex flex-col'>
            <label htmlFor="bio" className="font-semibold text-gray-700">Bio</label>
            <textarea
              id="bio"
              placeholder="Tell us about yourself"
              value={bio}
              className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 resize-y min-h-[80px]"
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-center gap-4">
            <button type="button" className="bg-blue-500 text-white p-2 rounded-lg" onClick={handleRevert}>
              Revert Changes
            </button>
            <button type="submit" className="bg-red-500 text-white p-2 rounded-lg">
              Edit Changes
            </button>
          </div>

        </form>
        
        <ConfirmationDialog 
          isOpen={isDialogOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title="Confirm Edit"
          message="Are you sure you want to edit your information?"
        />
        {message && <div className="text-center text-blue-600">{message}</div>}
      </div>
    </div>
  );
}

export default EditInfo;
