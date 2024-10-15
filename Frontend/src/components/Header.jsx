import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
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
                    {/* <Link to="/Courses" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80">Courses </Link> */}

                    <Link to="/About" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> About Us </Link>

                    <Link to="/admin" title="" className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"> Sell Course</Link>

                    <div className="w-px h-5 bg-black/20"></div>

                    <Link to="#" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-white hover:text-white transition-all duration-200 focus:bg-black focus:text-white" role="button"> Log In </Link>
                    <Link to="#" title="" className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-white hover:text-white transition-all duration-200 focus:bg-black focus:text-white" role="button"> Sign Up</Link>

                </div>
            </div>
        </div>
    </header>
  );
}

export default Header;
