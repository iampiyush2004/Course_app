import React from 'react'

function EditCourse() {
  return (
    <div>EditCourse</div>
  )
}

export default EditCourse

// import { useLocation } from 'react-router-dom';

// const EditCourse = () => {
//   const location = useLocation();
//   const { courseId, title } = location.state || {}; // Use optional chaining to avoid errors if state is not provided

//   return (
//     <div>
//       <h1>Edit Course: {title}</h1>
//       {/* You can use courseId to fetch course data or handle edits */}
//     </div>
//   );
// };

// export default EditCourse;
