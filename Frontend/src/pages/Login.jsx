import React from 'react';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="bg-white/50 backdrop-blur-sm border border-green-100 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col items-center p-6 md:p-12">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-gray-800 text-center">What best describes you?</h1>
        
        <div className='flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-12 w-full'>
          {/* Student Option */}
          <Link to="/student-login" className="group flex flex-col items-center p-8 bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-green-500 w-full md:w-1/2">
            <div className="p-8 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors mb-6 shadow-inner">
              <FaUserGraduate className="text-green-600 w-16 h-16 md:w-24 md:h-24 transition-transform group-hover:scale-110" />
            </div>
            <div className='text-center'>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Student</div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                <span className="block font-medium">Ready to elevate your skills?</span>
                <span className="block italic text-green-600 font-semibold mt-1">Discover our exciting courses!</span>
              </p>
            </div>
            <div className="mt-8 px-6 py-2 bg-green-600 text-white rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Get Started
            </div>
          </Link>

          {/* Teacher Option */}
          <Link to="/admin" className="group flex flex-col items-center p-8 bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-500 w-full md:w-1/2">
            <div className="p-8 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors mb-6 shadow-inner">
              <FaChalkboardTeacher className="text-orange-600 w-16 h-16 md:w-24 md:h-24 transition-transform group-hover:scale-110" />
            </div>
            <div className='text-center'>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Teacher</div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                <span className="block font-medium">Share your knowledge with others!</span>
                <span className="block italic text-orange-600 font-semibold mt-1">Start selling your courses today!</span>
              </p>
            </div>
            <div className="mt-8 px-6 py-2 bg-orange-600 text-white rounded-full font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Join Now
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
