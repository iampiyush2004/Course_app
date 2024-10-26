import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../Context/Context';

function Notification() {
  const { notificationData, changeNotificationData } = useContext(Context);
  const [isVisible, setIsVisible] = useState(false);

  const closeNotification = () => {
    setIsVisible(false);
    setTimeout(() => {
      changeNotificationData('');
    }, 300); 
  };

  useEffect(() => {
    if (notificationData.length !== 0) {
      setIsVisible(true); 
      const timer = setTimeout(closeNotification, 5000); 

      return () => clearTimeout(timer);
    }
  }, [notificationData]);

  return (
    notificationData.length !== 0 ? (
      <div className={`fixed top-10 right-5 w-1/5 bg-white text-blue-500 px-4 py-3 rounded shadow-lg flex justify-between items-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span>{notificationData}</span>
        <button className="ml-4 text-black" onClick={closeNotification}>
          &#10060;
        </button>
      </div>
    ) : null
  );
}

export default Notification;
