import React from 'react';

function Card({ 
  title = "title", 
  description = "", 
  imageLink = "",
  price = "" ,
  buttonText,
  handleClick,
  rating = 3,  
  usersEnrolled = 1200
}) {
  return (
    <div className="w-[100%] mx-auto bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 flex flex-col">
      <img className="w-full h-48 object-cover" src={imageLink} alt={title} />
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-semibold text-gray-800">{price==0?"FREE":`₹ ${price}`}</p>
          <div className="flex items-center">
            {Array.from({ length: rating }, (_, index) => (
              <span key={index}>⭐</span>
            ))}
          </div>
        </div>
        <div className="flex-grow"></div> {/* This spacer pushes the button to the bottom */}
        {buttonText?<div className="mt-6 flex justify-center">
          <button 
            className="inline-flex items-center justify-center px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded transition duration-200 w-full max-w-xs"
            onClick={handleClick}
          >
            {buttonText}
          </button>
        </div>:<div></div>}
      </div>
    </div>
  );
}

export default Card;