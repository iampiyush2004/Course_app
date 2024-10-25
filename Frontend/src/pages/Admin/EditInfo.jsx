import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function EditInfo() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [experience, setExperience] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const location = useLocation();
  const val = location.state || {};
  const handleRevert = () => {
    val.name && setName(val.name);
    // val.age && setDob(val.age);   // updation in data base 
    val.experience && setExperience(val.experience);
    val.company && setCompany(val.company);
    val.bio && setBio(val.bio);   // addition of bio oin data base
  };
  useEffect(()=>{
    handleRevert()
  },[])
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log({
      name,
      dob,
      experience,
      company,
      bio,
    });
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

        <label htmlFor="dob" className="font-semibold text-gray-700">Date of Birth</label>
        <input
          id="dob"
          type="date"
          value={dob}
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          onChange={(e) => setDob(e.target.value)}
        />

        <label htmlFor="experience" className="font-semibold text-gray-700">Experience</label>
        <input
          id="experience"
          type="number"
          min={0}
          max={150}
          placeholder="Enter your experience"
          value={experience}
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          onChange={(e) => setExperience(e.target.value)}
        />

        <label htmlFor="company" className="font-semibold text-gray-700">Company</label>
        <input
          id="company"
          type="text"
          placeholder="Enter your company"
          value={company}
          className="border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
          onChange={(e) => setCompany(e.target.value)}
        />

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
