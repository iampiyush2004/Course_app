import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import handleRazorpayPayment from '../payments/razorpayIntegration';
import Reviews from './Reviews';
import { Context } from '../../Context/Context';

function CourseInfo() {
  const { course_id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadMore, setIsReadMore] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {isStudentLoggedIn,changeNotificationData,isLoggedIn,checkStudent} = useContext(Context)
  const navigate = useNavigate();

  useEffect(() => {
    const retrieveData = async () => {
      try {
        // Fetch course details
        const courseResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/courses/${course_id}`, {
          withCredentials: true,
        });
        if (courseResponse.status === 200) {
          setData(courseResponse.data);
        }

        // Fetch user details to check purchase status
        if(isStudentLoggedIn){
          const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/user/me`, {
            withCredentials: true,
          });
  
          if (userResponse.status === 200) {
            const userData = userResponse.data;
            // Check if the course_id exists in the coursePurchased array
            setIsPurchased(userData.coursePurchased.includes(course_id));
          }
        }
      } catch (error) {
        console.error("Error occurred while fetching course or user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    retrieveData();
  }, [course_id, isStudentLoggedIn]);

  const handleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const handleBuyNow = async () => {
    if(!isStudentLoggedIn && isLoggedIn) {
      changeNotificationData("Login as a Student!!!")
      return
    }
    if(!isStudentLoggedIn) {
      changeNotificationData("Login First!!!")
      return
    }
    if (isPurchased) {
      // Directly navigate to the videos if purchased
      navigate(`/courses/${course_id}/videos/123`);
    } else {
      // Proceed with the payment process
      try {
        await handleRazorpayPayment(course_id, async () => {
          await checkStudent(); // Refresh user data after purchase
          changeNotificationData("Payment successful! Redirecting to 'My Courses' page...")
          navigate(`/courses/${course_id}/videos/123`);
        });
      } catch (error) {
        changeNotificationData("Failed to initiate payment. Please try again.")
        setErrorMessage("Failed to initiate payment. Please try again.");
        console.error("Payment initiation error:", error);
      }
    }
  };

  const words = data ? data.bio.split(' ') : [];
  const displayBio = isReadMore ? data.bio : words.slice(0, 50).join(' ') + (words.length > 50 ? '...' : '');

  return (
    <div className='min-h-screen'>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='flex flex-col lg:flex-row px-4 md:px-10 lg:px-20 py-6 md:py-10 gap-10'>
          {/* Left Part - Core Content */}
          <div className='w-full lg:w-3/5 flex flex-col gap-y-10 order-2 lg:order-1'>
            <div className='bg-white rounded-[2rem] shadow-xl p-6 md:p-8 flex flex-col items-center border border-green-50'>
              <div className='bg-gray-50 p-2 md:p-4 rounded-2xl flex flex-col items-center w-full mb-6'>
                <img src={data?.imageLink} alt={data?.title} className='w-full max-w-2xl rounded-xl shadow-lg h-auto aspect-video object-cover' />
              </div>
              <div className='text-left w-full'>
                <h2 className='text-xl md:text-2xl text-gray-700 leading-relaxed font-medium'>{displayBio}</h2>
              </div>
              {words.length > 50 && (
                <button 
                  onClick={handleReadMore} 
                  className='mt-6 px-8 py-2 bg-green-50 text-green-600 rounded-full font-bold hover:bg-green-100 transition-colors'
                >
                  {isReadMore ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Course Roadmap */}
            <div className='bg-white p-6 md:p-8 rounded-[2rem] shadow-xl flex flex-col w-full border border-green-50'>
              <h3 className='text-3xl font-extrabold text-gray-800 mb-8 flex items-center gap-3'>
                <span className='p-2 bg-blue-100 rounded-lg text-blue-600 text-sm'>Roadmap</span>
                Course Curriculum
              </h3>
              {data?.videos.length ? (
                <div className='flex flex-col w-full space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar'>
                  {data?.videos.map((val, index) => (
                    <div key={index} className='flex flex-col sm:flex-row justify-start items-start sm:items-center gap-6 w-full rounded-2xl p-4 bg-gray-50 border border-transparent hover:border-green-200 transition-all group'>
                      <div className='w-full sm:w-1/3 h-40 sm:h-28 rounded-xl shadow-md overflow-hidden relative'>
                        <img src={val.thumbnail} alt={val.description} className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                        <div className='absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                           <span className='bg-white/90 p-2 rounded-full text-blue-600'>▶</span>
                        </div>
                      </div>
                      <div className='flex-1'>
                        <div className='text-left text-gray-800 font-bold text-xl mb-1 truncate'>{val.title}</div>
                        <div className='text-gray-500 text-sm overflow-hidden text-ellipsis line-clamp-2'>{val.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-10 text-gray-400 font-medium'>Curriculum coming soon!!</div>
              )}
            </div>

            {/* Review Section */}
            <Reviews course_id={course_id}/>
          </div>

          {/* Right Part - Sidebar Info */}
          <div className='w-full lg:w-1/3 lg:block order-1 lg:order-2 lg:sticky lg:top-28 h-fit'>
            <div className='bg-white rounded-[2rem] shadow-2xl p-8 border border-green-50'>
              <div className='flex justify-between items-start mb-6'>
                <div className='flex items-center text-xs font-bold text-gray-500 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100'>
                  <span className='mr-2 font-black text-yellow-600 uppercase tracking-tighter'>Course</span>
                  <span className='text-yellow-600'>
                     {data?.totalReviews > 0 ? (data.totalStars / data.totalReviews).toFixed(1) : "0.0"} ★
                  </span>
                </div>
                <div className='text-xs font-semibold text-gray-400'>
                  {data?.totalReviews || 0} learners reviewed
                </div>
              </div>
              
              <h1 className='text-3xl font-black text-gray-900 mb-4 leading-tight'>{data?.title}</h1>
              <p className='text-lg text-gray-600 mb-8 line-clamp-3'>{data?.description}</p>

              <div className='mb-8 border-t border-gray-100 pt-6 flex items-center p-4 bg-blue-50/30 rounded-2xl'>
                <img 
                  src={data?.teacher.avatar} 
                  alt={data?.teacher.name} 
                  className='w-14 h-14 rounded-full mr-4 border-2 border-white shadow-sm' 
                />
                <div>
                  <p className='text-xs text-blue-600 font-bold uppercase tracking-widest mb-0.5'>Instructor</p>
                  <Link to={`/teacher/${data?.teacher._id}`} className='font-black text-gray-900 text-xl hover:text-blue-600 transition-colors'>
                    {data?.teacher.name ? data?.teacher.name : "Expert Mentor"}
                  </Link>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 mb-8'>
                <div className='p-4 bg-green-50/50 rounded-2xl text-center border border-green-100/50'>
                  <p className='text-2xl font-black text-green-700'>{data?.usersEnrolled ? data?.usersEnrolled : 0}</p>
                  <p className='text-[10px] font-bold text-green-600 uppercase tracking-widest'>Enrolled</p>
                </div>
                <div className='p-4 bg-orange-50/50 rounded-2xl text-center border border-orange-100/50'>
                  <p className='text-2xl font-black text-orange-700'>{data?.videos.length || 0}</p>
                  <p className='text-[10px] font-bold text-orange-600 uppercase tracking-widest'>Lessons</p>
                </div>
              </div>

              <div className='mb-8 flex items-end justify-center gap-2'>
                <span className='text-4xl font-black text-gray-900'>₹{data?.price.toLocaleString()}</span>
                <span className='text-xs text-gray-400 font-bold mb-2 uppercase underline decoration-green-400'>Lifetime Access</span>
              </div>

              {errorMessage && (
                <div className='bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 mb-6 animate-shake'>
                  {errorMessage}
                </div>
              )}

              <button 
                className='w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 text-xl flex items-center justify-center gap-3 group' 
                onClick={handleBuyNow}
              >
                {isPurchased ? (
                  <><span>▶</span> Start Learning</>
                ) : (
                  <><span>💳</span> Buy Now</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseInfo;

