import { useEffect, useState } from "react";
import Card from "../components/card";

function Courses() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/admin/courses")
      .then((res) => res.json())
      .then((res) => setData(res.courses));
  }, []);

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.length === 0 ? (
          <div>Good Things Take Time</div>
        ) : (
          data.slice(3,9).map((val) => (
            <Card 
              key={val._id}
              title={val.title} 
              description={val.description} 
              imageLink={val.imageLink} 
              price={val.price} 
            />
          ))
        )}
        {/* {console.log(data)} */}
      </div>
    </div>
  );
}

export default Courses;
