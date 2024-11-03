import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Context } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import UserDropdown from './UserDropdown';

export function Header() {
    const navigate = useNavigate(); 
    const {setUserData, isLoggedIn, checkAdmin, dataFetcher} = useContext(Context)
    const [data,setData] = useState(null)
    const handleLogout = async () => {
      await axios.post('http://localhost:3000/admin/logout',null,{
        withCredentials : true
      });
      localStorage.clear();
      checkAdmin()
      setUserData(null)
      navigate("/")
    };

    useEffect(()=>{
        if(!isLoggedIn) return
        const localdata = localStorage.getItem("data")
        console.log(JSON.parse(localdata))
        setData(JSON.parse(localdata))
    },[dataFetcher])

    const redirectCourses = () => {
        navigate("/adminName/courses")
    }
    const redirectProfile = () => {
        navigate("/adminName")
    }

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

                        <Link to="/adminName/AddCourse" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Sell Course</Link>

                        <div className="w-px h-5 bg-black/20"></div>

                        {
                            isLoggedIn && <UserDropdown data={{ avatar: data?.avatar, name: data?.name }} handleLogout={handleLogout} redirectCourses={redirectCourses} redirectProfile={redirectProfile} />
                        }    

                        {!isLoggedIn &&
                        <Link to="/login" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-green-200 hover:text-white transition-all duration-200  focus:text-white" role="button">
                            Log In
                        </Link>}

                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;