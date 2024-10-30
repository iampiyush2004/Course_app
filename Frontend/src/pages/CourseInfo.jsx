import React from 'react';

function CoursePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="fixed top-20 right-20 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-white">Course Info</h2>
        <p className="text-white">Course Description</p>
        <p className="text-white">Course Price: $99</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-800 p-4 rounded-lg">
          <img src="course_pic.jpg" alt="Course Picture" className="w-full h-64 object-cover rounded-lg" />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <p className="text-white">Teacher Name</p>
          <p className="text-white">Teacher Bio</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <h2 className="text-white">Reviews</h2>
          <div className="overflow-y-auto max-h-48">
            <div className="mt-2">
              <p className="text-white">Review 1: This is a great course!</p>
              <p className="text-white">Review 2: I learned a lot from this course.</p>
              {/* Add more reviews as needed */}
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default   
 CoursePage;