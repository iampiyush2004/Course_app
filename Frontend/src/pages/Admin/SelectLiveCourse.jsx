
// import { useContext, useEffect, useState } from "react";
// import Card from "../../components/card";
// import { Link } from "react-router-dom";
// import { Context } from "../../Context/Context";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// function SelectLiveCourse() {
//   const [data, setData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [isScheduling, setIsScheduling] = useState(false);
//   const [scheduledDate, setScheduledDate] = useState(null);
//   const { dataFetcher, userData } = useContext(Context);
  
//   useEffect(() => {
//     if (!userData) {
//       dataFetcher();
//     } else {
//       setData(userData?.createdCourses || []);
//     }
//   }, [userData, dataFetcher]);

//   useEffect(() => {
//     if (search === "") {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter(course =>
//         course.title.toLowerCase().includes(search.toLowerCase())
//       );
//       setFilteredData(filtered);
//     }
//   }, [search, data]);

//   const openModal = (course) => {
//     setSelectedCourse(course);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setIsScheduling(false);
//     setScheduledDate(null);
//   };

//   const handleGoLiveNow = () => {
//     console.log("Starting live session for:", selectedCourse);
//     closeModal();
//   };

//   const handleScheduleLater = () => {
//     if (scheduledDate) {
//       console.log("Scheduled live session for:", selectedCourse, "on", scheduledDate);
//       closeModal();
//     } else {
//       alert("Please select a date and time.");
//     }
//   };

//   return (
//     <div className="py-10 px-4 max-w-7xl mx-auto relative">
//       <div className="mb-8 flex items-center gap-8">
//         <Link to="/adminName" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
//           &larr; Back
//         </Link>
//         <h1 className="text-4xl font-bold text-gray-800 text-center">Select Course to Go Live</h1>
//       </div>
//       <div className="mb-3 bg-green-100 p-5 flex gap-5 flex-col rounded-lg shadow-lg">
//         <div>
//           <input 
//             type="text" 
//             placeholder="Search for Course" 
//             value={search} 
//             onChange={(e) => setSearch(e.target.value)} 
//             className="pl-3 py-2 pr-24 rounded-lg"
//           />
//         </div>
//         {!Array.isArray(filteredData) || filteredData.length === 0 ? (
//           <div className="flex flex-col items-center justify-center p-4">
//             <div className="w-full text-center text-red-600 text-xl font-semibold mb-4">
//               No Results Found
//             </div>
//             <Link 
//               to="/adminName/AddCourse" 
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition duration-300 shadow-lg"
//             >
//               Add Course
//             </Link>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredData.map((course) => (
//               <Card 
//                 key={course._id}
//                 title={course.title} 
//                 description={course.description} 
//                 imageLink={course.imageLink} 
//                 price={course.price} 
//                 buttonText={"Go Live"}
//                 handleClick={() => openModal(course)}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal */}
// {showModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//     <div className="bg-white rounded-lg p-10 w-full max-w-md mx-auto shadow-lg"> {/* Increased padding for more height */}
//       <h2 className="text-xl font-bold mb-6 text-center"> {/* Centered text */}
//         Go Live with {selectedCourse?.title}
//       </h2>
//       <div className="space-y-6"> {/* Increased vertical spacing between elements */}
//         {!isScheduling ? (
//           <>
//             <button 
//               onClick={handleGoLiveNow} 
//               className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded w-full"
//             >
//               Start Live Now
//             </button>
//             <button 
//               onClick={() => setIsScheduling(true)} 
//               className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded w-full mt-4"
//             >
//               Schedule for Later
//             </button>
//           </>
//         ) : (
//           <div className="space-y-6">
//             <DatePicker
//               selected={scheduledDate}
//               onChange={(date) => setScheduledDate(date)}
//               showTimeSelect
//               dateFormat="Pp"
//               className="w-full p-3 border border-gray-300 rounded"
//               placeholderText="Select date and time"
//             />
//             <button 
//               onClick={handleScheduleLater} 
//               className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded w-full mt-4"
//             >
//               Confirm Schedule
//             </button>
//           </div>
//         )}
//         <button 
//           onClick={closeModal} 
//           className="text-gray-600 font-semibold py-2 px-4 rounded w-full mt-8 hover:bg-gray-200"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// )}


      
//     </div>
//   );
// }

// export default SelectLiveCourse;
import { useContext, useEffect, useState } from "react";
import Card from "../../components/card";
import { Link } from "react-router-dom";
import { Context } from "../../Context/Context";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios'; // Import axios

function SelectLiveCourse() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const { dataFetcher, userData } = useContext(Context);
  
  useEffect(() => {
    if (!userData) {
      dataFetcher();
    } else {
      setData(userData?.createdCourses || []);
    }
  }, [userData, dataFetcher]);

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

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsScheduling(false);
    setScheduledDate(null);
  };

  // Function to start live session immediately
  const handleGoLiveNow = async () => {
    try {
      console.log("Starting live session for:", selectedCourse);
      
      // Call your backend API to create the room (start live session)
      const response = await axios.post('http://localhost:3000/live/create-room', {
        courseId: selectedCourse._id,
        startNow: true,
      });
      
      console.log("Live session started:", response.data);
      
      // Redirect user to the live session room URL
      window.location.href = response.data.url;
      closeModal();
    } catch (error) {
      console.error("Failed to start live session:", error);
      alert("Failed to start live session.");
    }
  };

  // Function to schedule live session for later
  const handleScheduleLater = async () => {
    if (scheduledDate) {
      try {
        const formattedDate = scheduledDate.toISOString();  // Format date to ISO string
        console.log("Scheduled Date:", formattedDate);  // Log the formatted date
        console.log("Course ID:", selectedCourse._id);
  
        const response = await axios.post('http://localhost:3000/live/create-room', {
          courseId: selectedCourse._id,
          startNow: false,
          scheduledDate: formattedDate,  // Send formatted date
        });
  
        // Check the response status from the backend
        if (response.data.success) {
          console.log("Scheduled live session:", response.data.roomData);
          closeModal();  // Close the modal on success
          alert("Live session scheduled successfully!");
        } else {
          alert("Failed to schedule live session.");
        }
      } catch (error) {
        console.error("Failed to schedule live session:", error);
        alert("Failed to schedule live session.");
      }
    } else {
      alert("Please select a date and time.");
    }
  };
  

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto relative">
      <div className="mb-8 flex items-center gap-8">
        <Link to="/adminName" className="bg-gray-800 text-white py-2 px-4 text-xl rounded-md transition-transform transform hover:bg-gray-700 hover:scale-105">
          &larr; Back
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 text-center">Select Course to Go Live</h1>
      </div>
      <div className="mb-3 bg-green-100 p-5 flex gap-5 flex-col rounded-lg shadow-lg">
        <div>
          <input 
            type="text" 
            placeholder="Search for Course" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-3 py-2 pr-24 rounded-lg"
          />
        </div>
        {!Array.isArray(filteredData) || filteredData.length === 0 ? (
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
            {filteredData.map((course) => (
              <Card 
                key={course._id}
                title={course.title} 
                description={course.description} 
                imageLink={course.imageLink} 
                price={course.price} 
                buttonText={"Go Live"} 
                handleClick={() => openModal(course)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-center">Go Live with {selectedCourse?.title}</h2>
            <div className="space-y-4">
              {!isScheduling ? (
                <>
                  <button 
                    onClick={handleGoLiveNow} 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
                  >
                    Start Live Now
                  </button>
                  <button 
                    onClick={() => setIsScheduling(true)} 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
                  >
                    Schedule for Later
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <DatePicker
                    selected={scheduledDate}
                    onChange={(date) => setScheduledDate(date)}
                    showTimeSelect
                    dateFormat="Pp"
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholderText="Select date and time"
                  />
                  <button 
                    onClick={handleScheduleLater} 
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full"
                  >
                    Confirm Schedule
                  </button>
                </div>
              )}
              <button 
                onClick={closeModal} 
                className="text-gray-600 font-semibold py-2 px-4 rounded w-full mt-2 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SelectLiveCourse;
