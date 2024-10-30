import { useEffect, useState } from "react";
import Card from "../components/card";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faArrowUp,faArrowDown } from '@fortawesome/free-solid-svg-icons';

function Courses() {
  const [data, setData] = useState([]);
  const [priceAsc,setPriceAsc] = useState(false)
  const [ratingAsc,setRatingAsc] = useState(false)
  useEffect(() => {
    fetch("http://localhost:3000/courses")
      .then((res) => res.json())
      .then((res) => setData(res.courses));
  }, []);

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Available Courses</h1>
      <div className="bg-blue-100 p-5 flex gap-5">
        <input type="input" placeholder="Search for Best Course" className="pl-3 py-2 pr-24 rounded-lg"></input>
        <button>
          <div className="flex items-center gap-1">
            <div>Price</div>
            
          </div>
        </button>
        <button>
          <div className="flex items-center gap-1">
            <div>Rating</div>
            
          </div>
        </button>
      </div>
      {data.length === 0 ? (
        <div className="w-full text-center">Good Things Take Time</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.slice(3,9).map((val) => (
          <Card 
            key={val._id}
            title={val.title} 
            description={val.description} 
            imageLink={val.imageLink} 
            price={val.price} 
            buttonText={"Enroll Now"}
          />
        ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
