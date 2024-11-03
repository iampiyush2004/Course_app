import React, { useState, useRef, useEffect } from 'react';

const UserDropdown = ({ data, redirectProfile, redirectCourses, handleLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Create a ref for the dropdown

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (callback) => {
        setIsOpen(false); // Close the dropdown
        callback(); // Call the provided callback function
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false); // Close the dropdown if clicked outside
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center" ref={dropdownRef} onClick={toggleDropdown}>
            <img 
                className="w-10 h-10 rounded-full mr-2 object-cover cursor-pointer" 
                src={data?.avatar} 
                alt="User Avatar" 
            />
            <div className="text-lg font-bold cursor-pointer" >{data?.name}</div>
            <button 
                className="ml-2 focus:outline-none"
            >
                <svg 
                    className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6l8 8 8-8" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-green-50 border border-gray-300 rounded shadow-lg z-10 top-9">
                    <div onClick={() => handleOptionClick(redirectProfile)} className="px-4 py-2 hover:bg-green-100 cursor-pointer border-b border-gray-200">Profile</div>
                    <div onClick={() => handleOptionClick(redirectCourses)} className="px-4 py-2 hover:bg-green-100 cursor-pointer border-b border-gray-200">Courses</div>
                    <div onClick={() => handleOptionClick(handleLogout)} className="px-4 py-2 hover:bg-green-100 cursor-pointer">Logout</div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
