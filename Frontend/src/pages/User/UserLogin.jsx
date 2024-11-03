import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import SignUp from './SignUp';
import SignIn from './SignIn';
import axios from 'axios';

function UserLogin() {
  const navigate = useNavigate(); 
  const [hasAccount, setHasAccount] = useState(true);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { changeNotificationData, checkStudent } = useContext(Context);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [experience, setExperience] = useState('');
  const [gender, setGender] = useState('');
  const [company, setCompany] = useState('');
  const [avatar, setAvatar] = useState(null);

  const clear = () => {
    setUsername('');
    setPassword('');
    setName('');
    setAge('');
    setExperience('');
    setGender('');
    setCompany('');
  };

  const toggleForm = () => {
    setHasAccount(!hasAccount);
    setMessage(''); 
  };

  useEffect(() => {
    clear();
  }, [hasAccount]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Please fill in both fields.');
      return;
    }

    const url = hasAccount ? `/user/signin` : `/user/signup`;
    let data = null; 
    if(hasAccount) {
      data = {username,password}
    }
    else  {
      data = new FormData();
      data.append("username", username);
      data.append("password", password);
      data.append("name", name);
      data.append("dob", age);
      data.append("institution", company);
      data.append("gender", gender);
      data.append("email",experience)
      if (avatar) {
        data.append("avatar", avatar);
      }
    }

    setIsLoading(true); 
    try {
      let response = null
      if(hasAccount){
        response = await axios.post(`http://localhost:3000${url}`, data, {
          withCredentials: true,
        });
      }
      else {
        response = await axios.post(`http://localhost:3000${url}`, data, {
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
          checkStudent()
          navigate('/user/profile'); 
        } else {
          setMessage('Signup successful! You can now log in.');
          setHasAccount(true); 
        }
      } else {
        setMessage(response.data.message || `Error: ${response.status}`);
      }
    } catch (error) {
      setMessage('Error: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className={`container mx-auto ${hasAccount ? "mt-24 mb-32" : ""} ${hasAccount ? "w-1/3" : "w-2/5"} p-6 bg-transparent rounded-lg shadow-lg flex flex-col`}>
      <h2 className="text-2xl font-bold text-center mb-6">
        Student {hasAccount ? 'Login' : 'Sign Up'}
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
          setAvatar={setAvatar}
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

export default UserLogin;
