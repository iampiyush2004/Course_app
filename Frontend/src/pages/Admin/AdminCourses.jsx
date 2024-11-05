import { useContext, useEffect, useState } from "react";
import Card from "../../components/card";
import {  } from "module";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../Context/Context";

function AdminCourses() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate()
  const {dataFetcher,userData} = useContext(Context)
  
  useEffect(() => {
    if(!userData) {
      dataFetcher()
    }
    else {
      setData(userData?.createdCourses||[]);
    }
  }, [userData,dataFetcher]);

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

  const handleClick = (val) => {
    navigate("/admin/edit", { state: { val } });
  }

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center gap-8">
        <Link to="/adminName" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
        &larr; Back
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 text-center">Your Courses</h1>
      </div>
      <div className="mb-3 bg-green-100 p-5 flex gap-5 flex-col rounded-lg shadow-lg">
        <div>
          <input 
            type="text" 
            placeholder="Search for Best Course" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-3 py-2 pr-24 rounded-lg"
          />
        </div>
        { !Array.isArray(filteredData) || filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full text-center text-red-600 text-xl font-semibold mb-4">
              No Results Found
            </div>
            <Link 
              to="/adminName/AddCourse" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300 shadow-lg"
            >
              Add Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((val) => (
              <Card 
                key={val._id}
                title={val.title} 
                description={val.description} 
                imageLink={val.imageLink} 
                price={val.price} 
                buttonText={"View"}
                handleClick={() => handleClick(val)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCourses;
