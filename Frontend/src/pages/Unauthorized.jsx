import React, { useState,useEffect } from 'react'

function Unauthorized() {
  const [time, setTime] = useState(0); // example state to track time or other data

  // This effect runs once on mount and sets up the interval
  useEffect(() => {
    // Function to be called every 10 seconds
    const intervalId = setInterval(() => {
      console.log('Running every 10 seconds');
      setTime((prevTime) => prevTime + 1); // Example: increment time
    }, 10000); // 10000 milliseconds = 10 seconds

    // Cleanup function to clear the interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  return (
    <div>
      <h1>Timer: {time} seconds</h1>
    </div>
  );
}

export default Unauthorized