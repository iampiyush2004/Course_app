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
  const [age,setAge] = useState('')
  const [experience,setExperience] = useState('')
  const [gender,setGender] = useState('')
  const [company,setCompany] = useState('')
  
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
    setAge('')
    setExperience('')
    setGender('')
    setCompany('')
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
    const data = hasAccount 
      ? { username, password } 
      : { username, password, name, age, experience, gender, company };

    setIsLoading(true); // Start loading

    try {
      const response = await axios.post(`http://localhost:3000${url}`, data, {
        withCredentials: true,
      });


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
    <div className={`container mx-auto ${hasAccount?"mt-24 mb-32":"mt-10"} max-w-md p-6 bg-transparent rounded-lg shadow-lg flex flex-col`}>
      <h2 className="text-2xl font-bold text-center mb-6">
        Teacher {hasAccount ? 'Login' : 'Sign Up'}
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
          age={age}
          setAge={setAge}
          experience={experience}
          setExperience={setExperience}
          gender={gender}
          setGender={setGender}
          company={company}
          setCompany={setCompany}
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      )}
  
      {message && <div className="mt-4 text-center text-blue-600">{message}</div>}
  
      <div className="mt-4 text-center">
        <p className="text-sm">
          {hasAccount ? "Don't have an account? " : "Already have an account? "}
          <button
            className="text-blue-500 font-semibold hover:underline"
            onClick={toggleForm}
          >
            {hasAccount ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
  
}

export default AdminLogin;