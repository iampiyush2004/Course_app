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
});

export const ContextProvider = ({ children }) => {
  const [userData,setUserData] = useState(null)
  const [notificationData,setNotificationData] = useState("")
  const [loaderData,setLoaderdata] = useState("")

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
      setLoaderdata("")
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    console.log("fetchin data from local storage")
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []); 

  return (
    <Context.Provider value={{ dataFetcher, userData ,setUserData, notificationData, changeNotificationData, loaderData,changeLoaderData }}>
      {children}
    </Context.Provider>
  );
};
