import React from 'react';
import { Link } from 'react-router-dom';
function Card({ title, description, imageLink, price }) {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden w-[100%]">
      <img className="w-full h-48 object-cover" src={imageLink} alt={title} />
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        <p className="mt-4 text-lg font-semibold text-gray-800">₹{price}</p>
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
