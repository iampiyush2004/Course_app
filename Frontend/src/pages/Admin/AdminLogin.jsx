import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../Context/Context';
import SignIn from './Signin.';
import SignUp from './SignUp';

function AdminLogin() {
  const navigate = useNavigate(); 
  const [hasAccount, setHasAccount] = useState(true);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { changeLoggedIn } = useContext(Context);
  
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
    <div className="container mx-auto mt-10 max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col">
      <h2 className="text-2xl font-bold text-center mb-6">
        {hasAccount ? 'Login Your Account' : 'Create New Account'}
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
          username={username} 
          setUsername={setUsername} 
          password={password} 
          setPassword={setPassword} 
          handleSubmit={handleSubmit} 
          isLoading={isLoading} 
        />
      )}
  
      {message && <div className="mt-4 text-center text-blue-600">{message}</div>}
  
      <div className="mt-4 text-center flex justify-center items-center gap-2">
        <p className="text-sm">
          {hasAccount ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          className="text-blue-500 font-semibold hover:underline"
          onClick={toggleForm}
        >
          {hasAccount ? 'Sign Up' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;






// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { Context } from '../../Context/Context';
// import { useContext } from 'react';
// function AdminLogin() {
//   const navigate = useNavigate(); 
//   const [hasAccount, setHasAccount] = useState(true);
//   const [message, setMessage] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const {changeLoggedIn} = useContext(Context)
 

//   return (
//     <div className="container mx-auto mt-10 max-w-md p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center mb-6">
//         {hasAccount ? 'Login' : 'Sign Up'}
//       </h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label htmlFor="username" className="block text-sm font-medium text-gray-700">
//             Username
//           </label>
//           <input
//             type="text"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             id="username"
//             placeholder="Enter your username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         </div>
        
//         <div className="mb-4">
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             type="password"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             id="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
  
//         <button
//           type="submit"
//           className={`w-full py-2 px-4 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition duration-200 ${
//             isLoading ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Submitting...' : hasAccount ? 'Login' : 'Sign Up'}
//         </button>
//       </form>
  
//       {message && <div className="mt-4 text-center text-blue-600">{message}</div>}
  
//       <div className="mt-4 text-center">
//         <p className="text-sm">
//           {hasAccount ? "Don't have an account?" : "Already have an account?"}
//           <button
//             className="text-blue-500 font-semibold hover:underline"
//             onClick={toggleForm}
//           >
//             {hasAccount ? 'Sign Up' : 'Login'}
//           </button>
//         </p>
//       </div>
//     </div>
//   );
  
// }

// export default AdminLogin;
