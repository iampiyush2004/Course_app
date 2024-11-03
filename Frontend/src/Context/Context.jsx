import axios from "axios"
import React, { createContext, useState, useEffect } from "react";
import useLoggedin from "../CutsomHook/useLoggedin";


export const Context = createContext({
  dataFetcher: () => {},
  userData: null,
  setUserData: () => {},
  notificationData:"",
  changeNotificationData: () => {},
  loaderData:"",
  changeLoaderData: () => {},
  isLoggedIn:null,
  checkAdmin:() => {}
});

export const ContextProvider = ({ children }) => {
  const [userData,setUserData] = useState(null)
  const [notificationData,setNotificationData] = useState("")
  const [loaderData,setLoaderdata] = useState("")
  const [isLoggedIn,setIsLoggedIn] = useState(null)

  const changeNotificationData = (data) => {
    setNotificationData(data)
  }
  const changeLoaderData = (data) => {
    setLoaderdata(data)
  } 

  const dataFetcher = async () => {
    setLoaderdata("Loading...")
    try {
      const response = await axios.get("http://localhost:3000/admin/teacherInfo", {
        withCredentials: true, 
      });
      localStorage.setItem('data', JSON.stringify(response.data));
      setUserData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally{
      setLoaderdata("")
    }
  };

  const checkAdmin = async () => {
    setIsLoggedIn(false)
    try {
      const response = await axios.get("http://localhost:3000/admin/isLoggedin", {
          withCredentials: true
      });
      if (response.status === 200) {
          if(response.data.isLoggedin === true) setIsLoggedIn(true);
          else setIsLoggedIn(false)
      } else {
          setIsLoggedIn(false);
      }
    } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false); 
    }
  }

  useEffect(() => {
      checkAdmin();
  }, []); 

  useEffect(() => {
    console.log("fetchin data from local storage")
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, [localStorage]); 

  return (
    <Context.Provider value={{ dataFetcher, userData ,setUserData, notificationData, changeNotificationData, loaderData, changeLoaderData, isLoggedIn, checkAdmin }}>
      {children}
    </Context.Provider>
  );
};
