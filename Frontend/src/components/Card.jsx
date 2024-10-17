import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Card({ 
  title = "title", 
  description = "", 
  imageLink = "",
  price = "" ,
  rating = 3,  
  usersEnrolled = 1200
}) {
  return (
    <div className="w-[100%] mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
      <img className="w-full h-48 object-cover" src={imageLink} alt={title} />
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-semibold text-gray-800">₹{price}</p>
          <div className="flex items-center">
            {Array.from({ length: rating }, (_, index) => (
              <FontAwesomeIcon key={index} icon={faStar} className="text-yellow-500" />
            ))}
          </div>
        </div>
        <div className="mt-6">
          <Link to="" className="inline-flex items-center justify-center px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded transition duration-200">
            Enroll Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
