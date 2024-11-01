import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../../components/Loading';

function CourseInfo() {
  const { course_id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadMore, setIsReadMore] = useState(false);
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

  // Split bio into words and manage display logic
  const words = data ? data.bio.split(' ') : [];
  const displayBio = isReadMore ? data.bio : words.slice(0, 50).join(' ') + (words.length > 50 ? '...' : '');

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='flex px-20 py-2 gap-x-10'>

          <div className='w-3/5 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-y-8'>
            <div className='bg-gray-100 p-5 rounded-lg flex flex-col items-center'>
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
            <div className='bg-gray-100 p-5 rounded-lg flex flex-col items-center w-screen'>
              hi
            </div>
          </div>

          <div className='w-1/3 bg-white rounded-lg shadow-lg p-6 fixed  right-10'>
            <h1 className='text-3xl font-bold text-gray-800 mb-4'>{data.title}</h1>
            <h2 className='text-lg text-gray-600 mb-4'>{data.description}</h2>
            
            <div className='mb-6'>
              <h3 className='text-xl font-semibold text-gray-700'>Statistics</h3>
              <p className='text-md text-gray-600'>
                Rating: <span className='font-bold text-gray-800'>{data.rating}</span>
              </p>
            </div>
            <button className='w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200'>
              Buy Now
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default CourseInfo;
