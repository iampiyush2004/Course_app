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
  const {changeLoggedIn} = useContext(Context)
 
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
    const data = { username, password };

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
    <div className="container mt-5">
      <h2>{hasAccount ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? 'Submitting...' : hasAccount ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>}

      <div className="mt-3">
        <p>
          {hasAccount ? "Don't have an account?" : "Already have an account?"}
          <button className="btn btn-link" onClick={toggleForm}>
            {hasAccount ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
