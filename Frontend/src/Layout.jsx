import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Notification from './pages/Notification'
import { ContextProvider } from './Context/Context'
function Layout() {
  return (
    <ContextProvider>
      <div className="bg-gradient-to-b from-green-50 to-green-200 min-h-screen">
        <Header/>
        <Notification/>
        <Outlet/>
        <Footer/>
      </div>
    </ContextProvider>
  )
}

export default Layout