import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';

function EditInfo() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState(''); // Added state for gender
  const location = useLocation();
  const navigate = useNavigate();
  const val = location.state || {};
  let token = localStorage.getItem('token');

  const handleRevert = () => {
    console.log(val);
    setName(val.name || ''); 
    setAge(val.age || ''); 
    setExperience(val.experience || ''); 
    setCompany(val.company || ''); 
    setBio(val.bio || '');
    setGender(val.gender || ''); 
  };

  useEffect(() => {
    handleRevert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if(!name || !age || !experience || !company || !bio || !gender) return 
    const data = {name,age,experience,company,bio,gender}
    console.log("hi")
    try {
        const response = await fetch("http://localhost:3000/admin/editProfile", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          navigate("/adminName");
          console.log("edited");
        } else {
          const errorData = await response.json();
          console.log("Error:", errorData.message || "Some error occurred");
        }
    } catch (error) {
      console.log(error);
    } 
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white flex flex-col space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <label htmlFor="name" className="font-semibold text-gray-700">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          placeholder="Enter your name"
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="age" className="font-semibold text-gray-700">Date of Birth</label>
        <input
          id="age"
          type="date"
          value={age}
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          onChange={(e) => setAge(e.target.value)}
        />

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

        <label htmlFor="company" className="font-semibold text-gray-700">Previous/Current Company</label>
        <input
          id="company"
          type="text"
          placeholder="Enter your company"
          value={company}
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          onChange={(e) => setCompany(e.target.value)}
        />

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

        <label htmlFor="bio" className="font-semibold text-gray-700">Bio</label>
        <textarea
          id="bio"
          placeholder="Tell us about yourself"
          value={bio}
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200 resize-y min-h-[100px]"
          onChange={(e) => setBio(e.target.value)}
        ></textarea>

        <div className="flex flex-row justify-center gap-4">
          <button type="button" className="bg-blue-500 text-white p-2 rounded-lg" onClick={handleRevert}>
            Revert Changes
          </button>
          <button type="submit" className="bg-red-500 text-white p-2 rounded-lg">
            Edit Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditInfo;