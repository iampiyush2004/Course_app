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
            await axios.post(`${import.meta.env.VITE_BACKEND_URI}/admin/logout`,null,{
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
            //         await axios.put(`${import.meta.env.VITE_BACKEND_URI}/progress/update/${courseId}`,local[keys],{withCredentials : true})
            //     })
            // }
            await axios.post(`${import.meta.env.VITE_BACKEND_URI}/user/logout`,{},{
                withCredentials : true
            })
            checkStudent()
        }
        localStorage.clear();
        navigate("/")
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className=' fixed z-50 bg-green-50 w-full rounded-b-md shadow-sm'>
            <div className="px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" title="" className="flex">
                            <h1 className=' font-extrabold text-2xl md:text-4xl'>UpScale</h1>
                        </Link>
                    </div>

                    {/* Mobile menu and Login button next to each other */}
                    <div className="flex items-center gap-4 lg:hidden">
                        {isLoggedIn === false && isStudentLoggedIn === false &&
                            <Link to="/login" className="inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-black border-2 border-black hover:bg-green-200 transition-all duration-200 rounded-md">
                                Log In
                            </Link>
                        }
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 text-black transition-all duration-200 bg-white rounded-md focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">
                        <Link to="/" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Home </Link>
                        <Link to="/About" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> About Us </Link>
                        {!isLoggedIn && <Link to="/Courses" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Explore Courses </Link>}
                        {!isStudentLoggedIn && <Link to="/adminName/AddCourse" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Sell Your Course</Link>}
                        <div className="w-px h-5 bg-black/20"></div>
                        {(isLoggedIn || isStudentLoggedIn) && (
                            <UserDropdown data={{ avatar: data?.avatar, name: data?.name }} handleLogout={handleLogout} redirectCourses={redirectCourses} redirectProfile={redirectProfile} />
                        )}
                        {!isLoggedIn && !isStudentLoggedIn && (
                            <Link to="/login" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-green-200 transition-all duration-200 focus:text-white" role="button">
                                Log In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Content */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-green-50 border-t border-gray-200 pb-4">
                        <div className="flex flex-col space-y-4 pt-4 px-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-black px-4 py-2 hover:bg-green-100 rounded-md"> Home </Link>
                            <Link to="/About" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-black px-4 py-2 hover:bg-green-100 rounded-md"> About Us </Link>
                            {!isLoggedIn && <Link to="/Courses" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-black px-4 py-2 hover:bg-green-100 rounded-md"> Explore Courses </Link>}
                            {!isStudentLoggedIn && <Link to="/adminName/AddCourse" onClick={() => setIsMenuOpen(false)} className="text-base font-semibold text-black px-4 py-2 hover:bg-green-100 rounded-md"> Sell Your Course</Link>}
                            <div className="border-t border-gray-200 pt-4">
                                {(isLoggedIn || isStudentLoggedIn) ? (
                                    <div className="px-4 flex flex-col space-y-2">
                                        <button onClick={() => { redirectProfile(); setIsMenuOpen(false); }} className="text-left py-2 font-semibold">Profile</button>
                                        <button onClick={() => { redirectCourses(); setIsMenuOpen(false); }} className="text-left py-2 font-semibold">My Courses</button>
                                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-left py-2 font-semibold text-red-500">Logout</button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
