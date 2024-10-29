import axios from "axios"
import React, { createContext, useState } from "react";


export const Context = createContext({
  dataFetcher: () => {},
  userData: null,
  setUserData: () => {},
  notificationData:"",
  changeNotificationData: () => {}
});

export const ContextProvider = ({ children }) => {
  const [userData,setUserData] = useState(null)
  const [notificationData,setNotificationData] = useState("")
  const changeNotificationData = (data) => {
    setNotificationData(data)
  } 

  const dataFetcher = async () => {
  try {
    const response = await axios.get("http://localhost:3000/admin/teacherInfo", {
      withCredentials: true, // This allows cookies to be sent with the request
    });

    setUserData(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <Context.Provider value={{ dataFetcher, userData ,setUserData, notificationData, changeNotificationData }}>
      {children}
    </Context.Provider>
  );
};
