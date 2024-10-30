import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Context } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

export function Header() {
    const navigate = useNavigate(); 
    const {setUserData} = useContext(Context)
    const [isLoggedin,setIsLoggedIn] = useState(false)
    const handleLogout = async () => {
      console.log("hi")
      await axios.post('http://localhost:3000/admin/logout',null,{
        withCredentials : true
      });
      setUserData(null)
      navigate("/")
    };

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get("http://localhost:3000/admin/isLoggedin", {
                    withCredentials: true
                });
                if (response.status === 200) {
                    if(response.data.isLoggedin === true) setIsLoggedIn(true);
                    else setIsLoggedIn(false)
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                setIsLoggedIn(false); // Set to false if there's an error
            }
        };

        checkLoginStatus();
    }, [handleLogout]); 
  return (
    <header className="">
        <div className="px-4 mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
                <div className="flex-shrink-0">
                    <Link to="" title="" className="flex">
                        <h1 className=' font-extrabold text-4xl'>UpStream</h1>
                    </Link>
                </div>

                <div className="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">

                    <Link to="/About" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> About Us </Link>

                    <Link to="/admin" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Sell Course</Link>

                    <div className="w-px h-5 bg-black/20"></div>
                    
                    {!isLoggedin ? (
                    <Link to="/login" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-green-200 hover:text-white transition-all duration-200  focus:text-white" role="button">
                        Log In
                    </Link>
                    ) : (
                    <button onClick={handleLogout} className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-green-200 hover:text-white transition-all duration-200  focus:text-white">
                        Log Out
                    </button>
                    )}

                </div>
            </div>
        </div>
    </header>
  );
}

export default Header;
