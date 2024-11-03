import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import handleRazorpayPayment from '../payments/razorpayIntegration';

function CourseInfo() {
  const { course_id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadMore, setIsReadMore] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/courses/${course_id}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setData(response.data);
          console.log(response.data);
        } else {
          console.log("Error occurred!");
        }
      } catch (error) {
        console.log("Error occurred!", error);
      } finally {
        setIsLoading(false);
      }
    };
    retrieveData();
  }, [course_id]);

  const handleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  
  const handleBuyNow = async () => {
    try {
      await handleRazorpayPayment(course_id, () => {
        alert("Payment successful! Redirecting to 'My Courses' page...");
        navigate('../Admin/CoursePage');
      });
    } catch (error) {
      setErrorMessage("Failed to initiate payment. Please try again.");
      console.error("Payment initiation error:", error);
    }
  };

  const words = data ? data.bio.split(' ') : [];
  const displayBio = isReadMore ? data.bio : words.slice(0, 50).join(' ') + (words.length > 50 ? '...' : '');

  return (
    <div className='min-h-screen'>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='flex px-20 py-2 gap-x-10'>
          <div className='w-3/5 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-y-8'>
            <div className='bg-gray-50 p-5 rounded-lg flex flex-col items-center w-full'>
              <img src={data.imageLink} alt={data.title} className='w-10/12 rounded-md mb-4 shadow-md' />
              <div className='text-left w-full'>
                <h2 className='text-lg text-gray-600'>{displayBio}</h2>
              </div>
              {words.length > 50 && (
                <button 
                  onClick={handleReadMore} 
                  className='mt-4 text-blue-500 hover:underline'
                >
                  {isReadMore ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            <div className='bg-gray-50 p-5 rounded-lg flex flex-col w-full'>
              <h3 className='text-2xl font-bold text-gray-700 mb-4'>Course RoadMap</h3>
              {data.videos.length ? (
                <div className='flex flex-col w-full max-h-80 overflow-y-auto'>
                  {data.videos.map((val, index) => (
                    <div key={index} className='flex justify-start items-center gap-x-10 w-full mb-3 border border-zinc-900 rounded-md p-2 bg-gray-100'>
                      <img src={val.thumbnail} alt={val.description} className='w-1/3 h-28 rounded-md shadow-md' />
                      <div>
                        <div className='text-left text-black font-semibold text-xl'>{val.title}</div>
                        <div className='text-gray-500'>{val.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>No Videos Available!!</div>
              )}
            </div>

            <div className='mt-6 bg-gray-50 p-5 rounded-lg w-full'>
              <h2 className='text-2xl font-bold text-gray-800 mb-4'>Reviews</h2>
              {data.reviews.length ? (
                <>
                  {data.reviews.slice(0, 5).map((review, index) => (
                    <div key={index} className='border border-gray-200 rounded-lg p-4 mb-4 flex items-start'>
                      <img 
                        src={review.avatar} 
                        alt={review.user} 
                        className='w-10 h-10 rounded-full mr-4' 
                      />
                      <div className='flex-1'>
                        <div className='font-semibold text-gray-800'>{review.user}</div>
                        <div className='text-gray-600'>{review.data}</div>
                      </div>
                    </div>
                  ))}
                  {data.reviews.length > 5 && (
                    <button 
                      onClick={handleLoadMore} 
                      className='mt-4 text-blue-500 hover:underline'
                    >
                      Load More Reviews
                    </button>
                  )}
                </>
              ) : (
                <div className='text-gray-600'>No Reviews Yet</div>
              )}
            </div>
          </div>

          <div className='w-1/3 bg-white rounded-lg shadow-lg p-8 fixed top-28 right-10'>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>{data.title}</h1>
            <h2 className='text-xl text-gray-600 mb-6'>{data.description}</h2>
            
            <div className='mb-6 border-t border-gray-200 pt-4 flex items-center'>
              <img 
                src={data.teacher.avatar} 
                alt={data.teacher.name} 
                className='w-12 h-12 rounded-full mr-3' 
              />
              <p className='text-md text-gray-600 mb-2'>
                <Link to="/teacherProfile" className='font-bold text-gray-800 text-xl'>
                  {data.teacher.name ? data.teacher.name : ""}
                </Link>
              </p>
            </div>
            
            <div className='mb-6 border-t border-gray-200 pt-4'>
              <p className='text-md text-gray-600 mb-2'>
                Rating: <span className='font-bold text-gray-800'>{data.rating ? data.rating : 3} ⭐</span>
              </p>
              <p className='text-md text-gray-600 mb-2'>
                Total Users Enrolled: <span className='font-bold text-gray-800'>{data.users ? data.users : 45}</span>
              </p>
              
            </div>
            
            <div className='mb-6 border-t border-gray-200 pt-4'>
              <div className='text-2xl font-bold text-gray-800 mb-2'>
                ₹ {data.price.toLocaleString()}
              </div>
            </div>
            
            {errorMessage && (
              <div className='text-red-500 mb-4'>
                {errorMessage}
              </div>
            )}
            
            <button className='w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition duration-200 shadow-md' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseInfo;
