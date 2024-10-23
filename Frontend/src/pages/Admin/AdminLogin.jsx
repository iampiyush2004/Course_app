import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import { useContext } from 'react';
function AdminLogin() {
  const navigate = useNavigate(); 
  const [hasAccount, setHasAccount] = useState(true);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { changeLoggedIn } = useContext(Context);
  const [name,setName] = useState('')
  const [age,setAge] = useState('')
  const [experience,setExperience] = useState('')
  const [gender,setGender] = useState('')
  const [company,setCompany] = useState('')

  const clear = () => {
    setUsername('')
    setPassword('')
    setName('')
    setAge('')
    setExperience('')
    setGender('')
    setCompany('')
  }
  useEffect(()=>{
    clear()
  },[hasAccount])
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        autoLogin(token);
      }
    }, []); 

  const autoLogin = async (token) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Auto-login successful!');
        changeLoggedIn(true)
        navigate('/adminName');
        
      } else {
        localStorage.removeItem('token'); 
        setMessage('Token expired. Please log in again.');
      }
    } catch (error) {
      setMessage('Auto-login failed: ' + error.message);
    }
  };

  const toggleForm = () => {
    setHasAccount(!hasAccount);
    setMessage(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Please fill in both fields.');
      return;
    }

      const url = hasAccount ? `/admin/signin` : `/admin/signup`;
      const data = hasAccount ? { username, password } : {username, password , name, age , experience,gender,company};

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(`http://localhost:3000${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        if (hasAccount) {
          // Store JWT token in local storage 
          localStorage.setItem('token', result.token);
          setMessage('Login successful!');
          changeLoggedIn(true)
          navigate('/adminName'); 
          
        } else {
          setMessage('Signup successful! You can now log in.');
          setHasAccount(true); 
        }
      } else {
        setMessage(result.message || `Error: ${response.status}`);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="container mx-auto mt-20 max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-6">
        {hasAccount ? 'Login' : 'Sign Up'}
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
          {hasAccount ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-500 font-semibold hover:underline"
            onClick={toggleForm}
          >
            {hasAccount ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
    </div>
  );
  
}

export default AdminLogin;