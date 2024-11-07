import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';

function TeacherInfo() {
  const { teacher_id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/admin/${teacher_id}`, {
          withCredentials: true
        });
        if (response.status === 200) {  
          setData(response.data);
          console.log(response.data);
        } else {
          console.log("Error in fetching teacher info");
        }
      } catch (error) {
        console.error("Error in fetching teacher info", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherInfo();
  }, [teacher_id]);

  const calculateAge = (dob) => {
    if (!dob) return "N/A"; 
    const birthDate = new Date(dob);
    if (isNaN(birthDate)) return "Invalid Date"; 
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className='p-10 w-full'>
          <div className='bg-green-100 rounded-lg shadow-md p-4 flex flex-col gap-y-10 w-full'>
            {/* Top Part */}
            <div className="flex items-center space-x-4 justify-start gap-x-20">
              <img src={data?.avatar} alt={data?.username} className="w-1/5 h-[40vh] rounded-full object-cover border-2 border-gray-300" />
              <div className="flex flex-col justify-around gap-y-10">
                <div>
                  <div className="text-6xl font-bold text-gray-800">{data?.name}</div>
                  <div className="text-3xl text-gray-500">@{data?.username}</div>
                </div>
                <div className="flex justify-around border border-gray-300 p-8 bg-gray-50 rounded-lg shadow-md gap-x-32">
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-700">Total Courses Uploaded</div>
                    <div className="text-2xl font-bold text-gray-800">{data?.createdCourses?.length || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-700">Total Users Enrolled</div>
                    <div className="text-2xl font-bold text-gray-800">1,246</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-lg text-gray-700">Best-Selling Course</div>
                    <div className="text-2xl font-bold text-gray-800">AI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className='flex w-full gap-x-10'>
              <div className='bg-white p-6 rounded-xl mx-10 w-full'>
                <h1 className='text-2xl font-semibold mb-2'>About</h1>
                <div className='bg-gray-50 p-6 rounded-xl'>
                  {data?.bio}
                </div>
              </div>
            </div>

            {/* Personal and Industrial Experience Sections */}
            <div className='flex w-full gap-x-2'>
              <div className='bg-gray-50 p-6 rounded-xl w-1/2 shadow-lg ml-10'>
                <h1 className='text-2xl font-bold mb-4'>Personal Information</h1>
                <div className='flex justify-start gap-x-20'>
                  <div className='flex flex-col bg-gray-100 rounded-md p-2 w-1/2 items-center'>
                    <h3 className='text-xl font-semibold mt-2'>Gender</h3>
                    <div className='text-lg text-gray-700 mb-4'>{data?.gender.toUpperCase()}</div>
                  </div>
                  <div className='flex flex-col bg-gray-100 rounded-md p-2 w-1/2 items-center'>
                    <h3 className='text-xl font-semibold mt-2'>Age</h3>
                    <div className='text-lg text-gray-700'>{calculateAge(data?.age)} years</div>
                  </div>
                </div>
              </div>

              <div className='bg-gray-50 p-6 rounded-xl w-1/2 shadow-lg mr-10'>
                <h1 className='text-2xl font-bold mb-4'>Industrial Experience</h1>
                <div className='flex justify-start gap-x-20'>
                  <div className='flex flex-col bg-gray-100 rounded-md p-2 w-1/2 items-center'>
                    <h3 className='text-xl font-semibold mt-2'>Current/Previous Company</h3>
                    <div className='text-lg text-gray-700 mb-4'>{data?.company}</div>
                  </div>
                  <div className='flex flex-col bg-gray-100 rounded-md p-2 w-1/2 items-center'>
                    <h3 className='text-xl font-semibold mt-2'>Experience</h3>
                    <div className='text-lg text-gray-700'>{data?.experience} (In Years)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex w-full gap-x-10'>
              <div className='bg-white p-6 rounded-xl mx-10 w-full'>
                <h1 className='text-2xl font-semibold mb-2'>Recent Courses</h1>
                <div className=' p-6 rounded-xl flex justify-center w-full gap-5'>
                  {
                    data && data.createdCourses && data.createdCourses.map((course)=>(
                      <div key={course?._id} className='w-1/3  bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105'>
                        <img src={course?.imageLink} alt={course?.title} className="w-full h-40 object-cover" />
                        <div className='p-4 flex justify-between items-center'>
                          <div className='text-lg font-semibold text-gray-800'>{course?.title}</div>
                          <div className='text-xl font-bold text-gray-900'>${course?.price}</div>
                        </div>
                        <button 
                          onClick={() => navigate(`/courses/${course._id}`)} 
                          className='w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-500 transition duration-200'
                        >
                          Explore Now
                        </button>
                      </div>

                    ))
                  }
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherInfo;
