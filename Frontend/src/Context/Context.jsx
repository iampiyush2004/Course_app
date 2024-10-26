import React, { createContext, useState } from "react";

export const Context = createContext({
  isLoggedIn: false,
  changeLoggedIn: () => {},
  dataFetcher: () => {},
  userData: null,
  setUserData: () => {}
});

export const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData,setUserData] = useState(null)
  const token = localStorage.getItem('token');
  const changeLoggedIn = (status) => {
    setIsLoggedIn(status);
  };

  const dataFetcher = () => {
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
    <Context.Provider value={{ isLoggedIn, changeLoggedIn, dataFetcher, userData ,setUserData }}>
      {children}
    </Context.Provider>
  );
};
