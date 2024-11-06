import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"
import { Context } from '../../Context/Context';
import { useNavigate } from 'react-router-dom';
function EditProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [message,setMessage] = useState("")
  const {changeNotificationData,checkStudent} = useContext(Context)
  const navigate = useNavigate()

  useEffect(() => {
    const localData = localStorage.getItem("user");
    if (localData) {
      const parsedData = JSON.parse(localData);
      setName(parsedData?.name || '');
      setEmail(parsedData?.email || '');
      setInstitution(parsedData?.institution || '');
      setDob(parsedData?.dob || '');
      setGender(parsedData?.gender || '');
    }
  }, []);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleInstitutionChange = (e) => setInstitution(e.target.value);
  const handleDobChange = (e) => setDob(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!name || !email || !institution || !dob || !gender) {
      setMessage("All field required!!!")
      return 
    } 
    const updatedData = {
      name,
      email,
      institution,
      dob,
      gender,
    };
    try {
      const response  = await axios.put("http://localhost:3000/user/editProfile",updatedData,{
        withCredentials:true
      })
      if(response.status===200){
        checkStudent()
        changeNotificationData("Profile Updated SuccessFully!!!")
        navigate("/user/profile")
      }
      else console.log("error in updating data")
    } catch (error) {
      console.error(error)
    }
    console.log('Form Submitted:', updatedData);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-lg mx-auto bg-green-50 p-6 rounded shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Edit Profile</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="name" className="text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="mb-4 p-2 border rounded"
            placeholder="Enter your name"
          />
          
          <label htmlFor="email" className="text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="mb-4 p-2 border rounded"
            placeholder="Enter your email"
          />
          
          <label htmlFor="institution" className="text-sm font-medium mb-2">Institution</label>
          <input
            type="text"
            id="institution"
            value={institution}
            onChange={handleInstitutionChange}
            className="mb-4 p-2 border rounded"
            placeholder="Enter your institution"
          />
          
          <label htmlFor="dob" className="text-sm font-medium mb-2">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={handleDobChange}
            className="mb-4 p-2 border rounded"
          />
          
          <label htmlFor="gender" className="text-sm font-medium mb-2">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={handleGenderChange}
            className="mb-4 p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          
          <button
            type="submit"
            className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          {message && <div className='text-blue-400 text-center mt-8'>{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
