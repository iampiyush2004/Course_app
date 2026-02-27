import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import { useContext } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';
import axios from 'axios';
import useLoggedin from '../../CutsomHook/useLoggedin';

function AdminLogin() {
  const navigate = useNavigate(); 
  const [hasAccount, setHasAccount] = useState(true);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { dataFetcher,changeNotificationData, checkAdmin } = useContext(Context);
  const [name,setName] = useState('')
  const [dob,setDob] = useState('')
  const [experience,setExperience] = useState('')
  const [gender,setGender] = useState('')
  const [company,setCompany] = useState('')
  const [email,setEmail] = useState('')
  const [avatar, setAvatar] = useState(null)
  
  const {isLoggedin} = useLoggedin()
  // Auto Login Implemented Here
  useEffect( () => {
    if(isLoggedin) {
      // dataFetcher()
      navigate('/adminName'); 
      checkAdmin()
    }
  },[isLoggedin])

  const clear = () => {
    setUsername('')
    setPassword('')
    setName('')
    setDob('')
    setExperience('')
    setGender('')
    setCompany('')
    setEmail('')
    setAvatar(null)
  }

  const toggleForm = () => {
    setHasAccount(!hasAccount);
    setMessage(''); 
  };
  
  useEffect(()=>{
    clear()
  },[hasAccount])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Please fill in both fields.');
      return;
    }

    const url = hasAccount ? `/admin/signin` : `/admin/signup`;
    let data = null;
    if (hasAccount) {
      data = { username, password };
    } else {
      data = new FormData();
      data.append("username", username);
      data.append("password", password);
      data.append("name", name);
      data.append("dob", dob);
      data.append("experience", experience);
      data.append("gender", gender);
      data.append("company", company);
      data.append("email", email);
      if (avatar) {
        data.append("avatar", avatar);
      }
    }

    setIsLoading(true); // Start loading

    try {
      let response = null;
      if (hasAccount) {
        response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}${url}`, data, {
          withCredentials: true,
        });
      } else {
        response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}${url}`, data, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }


      if (response.status === 200) {
        if (hasAccount) {
          setMessage('Login successful!');
          changeNotificationData("Login successful!!!");
          // dataFetcher()
          checkAdmin()
          navigate('/adminName'); 
        } else {
          setMessage('Signup successful! You can now log in.');
          setHasAccount(true); 
        }
      } else {
        setMessage(response.data.message || `Error: ${response.status}`);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className={`container mx-auto px-4 ${hasAccount ? "mt-16 md:mt-24 mb-16 md:mb-32" : "mt-10 md:mt-16 mb-10 md:mb-16"} w-full max-w-md md:max-w-2xl p-6 md:p-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col border border-green-100`}>
      <h2 className="text-3xl md:text-4xl font-black text-center mb-8 text-gray-800">
        Teacher <span className="text-orange-600">{hasAccount ? 'Login' : 'Sign Up'}</span>
      </h2>
      {hasAccount ? (
        <SignIn 
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      ) : (
        <SignUp 
          name={name}
          setName={setName}
          dob={dob}
          setDob={setDob}
          experience={experience}
          setExperience={setExperience}
          gender={gender}
          setGender={setGender}
          company={company}
          setCompany={setCompany}
          email={email}
          setEmail={setEmail}
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
          setAvatar={setAvatar}
        />
      )}
  
      {message && <div className="mt-6 text-center font-semibold text-orange-600 animate-pulse">{message}</div>}
  
      <div className="mt-8 text-center border-t border-gray-100 pt-6">
        <p className="text-gray-600 font-medium">
          {hasAccount ? "Don't have an account? " : "Already have an account? "}
          <button
            className="text-orange-600 font-bold hover:underline transition-all"
            onClick={toggleForm}
          >
            {hasAccount ? 'Create One' : 'Login Here'}
          </button>
        </p>
      </div>
    </div>
  );
  
}

export default AdminLogin;
