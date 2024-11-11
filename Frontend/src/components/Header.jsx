import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../Context/Context';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import UserDropdown from './UserDropdown';

export function Header() {
    const navigate = useNavigate(); 
    const {setUserData, isLoggedIn, checkAdmin, dataFetcher, isStudentLoggedIn, checkStudent} = useContext(Context)
    const [data,setData] = useState(null)

    useEffect(()=>{
        if(!isLoggedIn) return
        const localdata = localStorage.getItem("data")
        setData(JSON.parse(localdata))
    },[dataFetcher])

    useEffect( () => {
        if(!isStudentLoggedIn) return;
        const localdata = localStorage.getItem("user")
        setData(JSON.parse(localdata))
    }, [checkStudent])

    const redirectCourses = () => {
        if(isLoggedIn) navigate("/adminName/courses")
        if(isStudentLoggedIn) navigate("/user/courses")
        
    }
    const redirectProfile = () => {
        if(isLoggedIn) navigate("/adminName")
        if(isStudentLoggedIn) navigate("/user/profile")
    }
    const handleLogout = async () => {
        if(isLoggedIn){
            await axios.post('http://localhost:3000/admin/logout',null,{
                withCredentials : true
            });
            checkAdmin()
            setUserData(null)
        }
        if(isStudentLoggedIn){
            // const local = JSON.parse(localStorage.getItem("videoStamps"))
            // if(local){
            //     const keys = Object.keys(local)
            //     keys.map(async(courseId)=>{
            //         await axios.put(`http://localhost:3000/progress/update/${courseId}`,local[keys],{withCredentials : true})
            //     })
            // }
            await axios.post("http://localhost:3000/user/logout",{},{
                withCredentials : true
            })
            checkStudent()
        }
        localStorage.clear();
        navigate("/")
    };

    return (
        <header className=' fixed z-50 bg-green-50 w-full rounded-b-md'>
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex-shrink-0">
                        <Link to="" title="" className="flex">
                            <h1 className=' font-extrabold text-4xl'>UpScale</h1>
                        </Link>
                    </div>

                    <div className="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">

                        <Link to="/" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Home </Link>

                        <Link to="/About" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> About Us </Link>

                        {!isLoggedIn && <Link to="/Courses" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Explore Courses </Link>}

                        {!isStudentLoggedIn && <Link to="/adminName/AddCourse" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Sell Your Course</Link>}

                        <div className="w-px h-5 bg-black/20"></div>

                        {
                            isLoggedIn && <UserDropdown data={{ avatar: data?.avatar, name: data?.name }} handleLogout={handleLogout} redirectCourses={redirectCourses} redirectProfile={redirectProfile} />
                        } 

                        {
                            isStudentLoggedIn && <UserDropdown data={{ avatar: data?.avatar, name: data?.name }} handleLogout={handleLogout} redirectCourses={redirectCourses} redirectProfile={redirectProfile} />
                        }    

                        {!isLoggedIn && !isStudentLoggedIn &&
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