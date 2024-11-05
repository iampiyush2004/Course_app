import axios from "axios"
import React, { createContext, useState, useEffect } from "react";

export const Context = createContext({
  // admin
  dataFetcher: () => {},  
  userData: null,
  setUserData: () => {},
  notificationData:"",
  changeNotificationData: () => {},
  loaderData:"",
  changeLoaderData: () => {},
  isLoggedIn:null,
  checkAdmin:() => {},
  // user
  isStudentLoggedIn:null,
  checkStudent: () => {},
  studentData : null,
  studentDataFetcher : () => {}
});

export const ContextProvider = ({ children }) => {
  const [userData,setUserData] = useState(null)
  const [notificationData,setNotificationData] = useState("")
  const [loaderData,setLoaderdata] = useState("")
  const [isLoggedIn,setIsLoggedIn] = useState(null)

  // user
  const [isStudentLoggedIn,setStudentLoggedIn] = useState(null)
  const [studentData,setStudentData] = useState(null)

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
          if(response.data.isLoggedin === true) setIsLoggedIn(true),setStudentLoggedIn(false);
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
    const savedUserData = localStorage.getItem('data'); 
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, [localStorage]); 

  useEffect(() => {
    checkAdmin();
  }, []); 

  
  // student start
  
  const checkStudent = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/loggedin",{
        withCredentials:true
      })
      if(response.status===200){
        setStudentLoggedIn(response.data.isLoggedin)
        if(response.data.isLoggedin===true) {
          localStorage.setItem("user",JSON.stringify(response.data.user))
          setIsLoggedIn(false)
        }
      } else setStudentLoggedIn(false)
    } catch (error) {
      console.error(error)
      setStudentLoggedIn(false)
    }
  }

  useEffect( () => {
    const data = localStorage.getItem("user") 
    if(data){
      setStudentData(data)
    }
  },[localStorage])

  useEffect(() => {
    checkStudent();
  }, []); 

  return (
    <Context.Provider value={{ dataFetcher, userData ,setUserData, notificationData, changeNotificationData, loaderData, changeLoaderData, isLoggedIn, checkAdmin, isStudentLoggedIn, checkStudent}}>
      {children}
    </Context.Provider>
  );
};
