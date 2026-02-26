import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Notification from './pages/Notification'
import { ContextProvider } from './Context/Context'
import LoadingSpinner from './components/LoadingSpinner'
import Chatbot from './components/Chatbot'

function Layout() {
  return (
    <ContextProvider>
      <div className="bg-gradient-to-b from-green-50 to-green-200 min-h-screen">
        <Header/>
        <Notification/>
        <LoadingSpinner/>
        <Chatbot/>
        <div className='h-20'></div>
        <Outlet/>
        <Footer/>
      </div>
    </ContextProvider>
  )
}

export default Layout
