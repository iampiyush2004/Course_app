import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <h1 className='bg-green-400'>Welcome to Upstream</h1>
      <Link to="">User</Link>
      <Link to="/user">Admin</Link>
    </>
  )
}

export default Home