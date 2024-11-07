import { useEffect, useState } from "react";
import Card from "../../components/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Courses() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [priceAsc, setPriceAsc] = useState(false);
  const [ratingAsc, setRatingAsc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/courses/");
        setData(res.data.courses);
        setSortedData(res.data.courses); // Initialize sortedData
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = data.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (priceAsc) {
      filteredData.sort((a, b) => a.price - b.price);
    }

    if (ratingAsc) {
      filteredData.sort((a, b) => a.rating - b.rating); // Assuming 'rating' is a field in your course data
    }

    setSortedData(filteredData);
  }, [data, priceAsc, ratingAsc, searchTerm]);

  const handlePriceSort = () => {
    setPriceAsc(!priceAsc);
    setRatingAsc(false); // Reset rating sort
  };

  const handleRatingSort = () => {
    setRatingAsc(!ratingAsc);
    setPriceAsc(false); // Reset price sort
  };

  const handleClick = (id) => {
    navigate(`/courses/${id}`)
  }

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Available Courses</h1>
      <div className="bg-blue-100 p-5 flex gap-5">
        <input 
          type="text" 
          placeholder="Search for Best Course" 
          className="pl-3 py-2 pr-24 rounded-lg" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handlePriceSort}>
          <div className="flex items-center gap-1">
            <div>Price {priceAsc ? '▲' : '▼'}</div>
          </div>
        </button>
        <button onClick={handleRatingSort}>
          <div className="flex items-center gap-1">
            <div>Rating {ratingAsc ? '▲' : '▼'}</div>
          </div>
        </button>
      </div>
      {sortedData.length === 0 ? (
        <div className="w-full text-center">Good Things Take Time</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedData.map((val) => ( // Adjust slice as needed
            <Card 
              key={val._id}
              title={val.title} 
              description={val.description} 
              imageLink={val.imageLink} 
              price={val.price} 
              buttonText={"Enroll Now"}
              handleClick = {() => handleClick(val._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
