import { useState } from 'react'
import Navbar from './components/Navbar'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/routes'
import Login from './pages/Login'
function App() {
  return (
    <>
    <RouterProvider router={router}></RouterProvider>
    <Login />
    </>
  )
}

export default App
