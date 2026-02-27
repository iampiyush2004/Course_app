import React from 'react';

const SignIn = ({ username, setUsername, password, setPassword, handleSubmit, isLoading }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col">
        <label htmlFor="username" className="text-sm font-bold text-gray-700 mb-1 ml-1">
          Username
        </label>
        <input
          type="text"
          className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="password" className="text-sm font-bold text-gray-700 mb-1 ml-1">
          Password
        </label>
        <input
          type="password"
          className="block w-full border border-gray-200 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50/50"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
  
      <button
        type="submit"
        className={`w-full py-4 px-4 rounded-xl text-white font-black text-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Signing you in...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignIn;
