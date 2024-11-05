import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom'
function UserCourses() {
  const [data,setData] = useState(null)
  const [filteredData,setFilteredData] = useState(null)
  const [search,setSearch] = useState("")
  const [coursesShown,setCoursesShown] = useState(8)
  const navigate = useNavigate()
  useEffect(()=>{
    const localData = localStorage.getItem("user")
    if(localData){
      setData(JSON.parse(localData).coursePurchased)
      setFilteredData(JSON.parse(localData).coursePurchased)
    }
  },[])

  useEffect(() => {
    if (search === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(course =>
        course.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  return (
    <div className='min-h-screen px-5 py-2'>
      <div className='bg-green-50 w-full shadow-md p-4 rounded-md flex flex-col gap-y-10'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl font-bold'>Your Purchased Courses</h1>
          <button className='bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200' onClick={()=>navigate("/courses")}>
            Add More Courses
          </button>
        </div>

        <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden w-1/2 ml-4 p-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-60 pl-4 py-3 text-sm text-gray-700 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            className="px-16 py-3 bg-green-500 text-white text-sm font-semibold rounded-r-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
          >
            Search
          </button>
        </div>

        <div className='bg-green-100 shadow-lg rounded-lg p-6 w-full mx-auto'>
          {filteredData && filteredData.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
              {filteredData.slice(0,Math.min(coursesShown,filteredData.length)).map((course) => (
                <div key={course._id} className='bg-gray-50 p-5 rounded-lg shadow-md mb-6 transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col gap-y-4' >
                  <div className='flex gap-x-5'>
                    <img
                      src={course.imageLink}
                      alt={course.title}
                      className='w-1/3 h-32 object-cover rounded-lg'
                    />
                    <div className='w-2/3'>
                      <div className='font-semibold text-xl text-gray-800 mb-2'>{course.title}</div>
                      <div className='text-gray-600 text-sm bg-green-50 p-2 rounded-md w-full'>{course.description}</div>
                    </div>
                  </div>
            
                  {/* Progress section */}
                  <div className='mt-4'>
                    <div className='text-gray-700 text-sm font-semibold mb-2'>
                      Course Progress: {course.progress || 45}% Completed
                    </div>
                    <div className='relative pt-1'>
                      <div className='flex mb-2 items-center justify-between'>
                        <div className='text-xs font-semibold inline-block py-1 uppercase'>{course?.progress || 45}%</div>
                      </div>
                      <div className='flex mb-2'>
                        <div className='w-full bg-gray-200 rounded-full'>
                          <div
                            className='bg-green-500 text-xs leading-none py-1 text-center text-white rounded-full'
                            style={{ width: `${course?.progress || 45}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
            
                  {/* Continue Learning Button */}
                  <button className='px-6 py-2 text-white bg-green-500 hover:bg-green-600 rounded-full font-semibold transition duration-200' onClick={()=>navigate(`/courses/${course._id}/videos/123`)}>
                    Continue Learning <span className="text-xl">&#8594;</span>
                  </button>
                </div>
              ))}
            </div>
          
          ) : (
            <div className='text-center text-gray-500'>
              No courses available at the moment.
            </div>
          )}
          {
            filteredData && filteredData.length>coursesShown &&
            <div className='flex justify-center mt-4'>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2" onClick={() => setCoursesShown((prev) => prev + 8)}>
                Show More Courses
              </button>
            </div>


          }
        </div>

        
      </div>
    </div>
  )
}

export default UserCourses