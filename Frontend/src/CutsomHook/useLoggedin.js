import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../Context/Context";
import { Navigate, useNavigate } from "react-router-dom";

const useLoggedin = () => {
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const {changeLoaderData} = useContext(Context)
  const navigate = useNavigate()
  useEffect(() => {
    // changeLoaderData("Loading")
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/isLoggedin", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setIsLoggedIn(response.data.isLoggedin);
        } else {
          navigate("/admin")
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false); 
      } finally{
        changeLoaderData("")
      }
    };

    checkLoginStatus();
  }); 

  return { isLoggedin, setIsLoggedIn };
};

export default useLoggedin;
