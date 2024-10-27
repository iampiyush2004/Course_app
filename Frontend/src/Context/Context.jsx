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

  const dataFetcher = (token=0) => {
    if(token===0) return
    fetch("http://localhost:3000/admin/teacherInfo", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then(data => {
      setUserData(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <Context.Provider value={{ dataFetcher, userData ,setUserData, notificationData, changeNotificationData }}>
      {children}
    </Context.Provider>
  );
};
