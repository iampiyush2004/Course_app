import React from 'react'

function Admin({
  name="Piyush"
}) {
  return (
    <div className='h-screen'>
      <div>
        <img src="" alt={name}/>
      </div>
      <div>
        Welcome Back
      </div>
    </div>
  )
}

export default Admin