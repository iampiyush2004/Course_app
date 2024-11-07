import React, { useState,useEffect } from 'react'

function Unauthorized() {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Custom function to run before the page closes
      console.log("Page is about to close!");

      // Optionally, you can show a confirmation dialog:
      event.returnValue = "Are you sure you want to leave?";
      // This will trigger a prompt asking the user if they're sure they want to leave.
    };

    // Add the event listener for the beforeunload event
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <h1>My Page</h1>
      <p>Try closing or navigating away from this page.</p>
    </div>
  );
};

export default Unauthorized