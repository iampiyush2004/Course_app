import React, { useContext } from 'react';
import { Context } from '../Context/Context';

const LoadingSpinner = () => {
  const {loaderData} = useContext(Context)
  return (
    loaderData.length === 0? null :
    <div className="fixed inset-0 flex items-center justify-center bg-green-100 bg-opacity-75 backdrop-blur-sm z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-zinc-600 border-t-transparent"></div>
      <div className="absolute text-lg font-semibold text-gray-700">{loaderData}</div>
    </div>
    
  );
};

export default LoadingSpinner;
