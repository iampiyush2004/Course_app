import React, { useState } from 'react';

function Login() {
  const [hasAccount, setHasAccount] = useState(true);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setHasAccount(!hasAccount);
    setMessage(''); // Clear message when toggling
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = hasAccount ? '/admin/signin' : '/admin/signup';
    const data = { username, password };

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
          // Store JWT token in local storage or context for further use
          localStorage.setItem('token', result.token);
          setMessage('Login successful!');
          // Redirect or take user to the admin dashboard after login
        } else {
          setMessage('Signup successful! You can now log in.');
          setHasAccount(true); // Switch to login after signup
        }
      } else {
        setMessage(result.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
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
            value={username} // Bind value to state
            onChange={(e) => setUsername(e.target.value)} // Update state on change
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={password} // Bind value to state
            onChange={(e) => setPassword(e.target.value)} // Update state on change
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {hasAccount ? 'Login' : 'Sign Up'}
        </button>
      </form>

      {message && <div className="alert alert-info mt-3">{message}</div>} {/* Display messages */}

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

export default Login;
