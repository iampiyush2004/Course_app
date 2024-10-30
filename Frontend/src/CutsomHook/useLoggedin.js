import { useState, useEffect } from "react";
import axios from "axios";

const useLoggedin = () => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/isLoggedin", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(response.data.isLoggedin);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false); 
      }
    };

    checkLoginStatus();
  }); 

  return { isLoggedin, setIsLoggedIn };
};

export default useLoggedin;
