import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="flex flex-col items-center mt-10 h-screen">
      <div className="bg-green-50 bg-opacity-0 w-2/3  mb-20 rounded-lg shadow-lg flex flex-col items-center p-6">
        <h1 className="text-2xl font-semibold mb-8 items-start">What best describes you?</h1>
        <div className='flex items-center justify-around p-6 gap-x-20 w-full'>
          <Link to="/student-login" className="flex flex-col items-center gap-y-4 border border-white rounded-md w-1/2 h-[400px] pt-2">
            <div className="border border-black p-5 rounded-3xl shadow hover:bg-green-200 transition duration-200 flex items-center justify-center h-full">
              <FaUserGraduate size={100} />
            </div>
            <div className='flex flex-col justify-center items-center h-full'>
              <div className="text-lg font-semibold text-gray-800">Student</div>
              <div className="text-sm text-gray-600 mt-2 text-center px-4">
                <div className="font-medium">Ready to elevate your skills?</div>
                <div className="font-medium mt-1">Discover our exciting courses!</div>
              </div>
            </div>
          </Link>

          <Link to="/admin" className="flex flex-col items-center gap-y-4 border border-white rounded-md w-1/2 h-[400px] pt-2">
            <div className="border border-black p-5 rounded-3xl shadow hover:bg-green-200 transition duration-200 flex items-center justify-center h-full">
              <FaChalkboardTeacher size={100} />
            </div>
            <div className='flex flex-col justify-center items-center h-full'>
              <div className="text-lg font-semibold text-gray-800">Teacher</div>
              <div className="text-sm text-gray-600 mt-2 text-center px-4">
                <div className="font-medium">Share your knowledge with others!</div>
                <div className="font-medium mt-1">Start selling your courses today!</div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
