import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../Layout'
import AdminLogin from '../pages/Admin/AdminLogin'
import Courses from '../pages/Courses'
import Admin from '../pages/Admin/Admin'
import AddCourse from '../pages/Admin/AddCourse'
import AdminCourses from '../pages/Admin/AdminCourses'
import EditCourse from '../pages/Admin/EditCourse'
import EditInfo from '../pages/Admin/editInfo'
import Unauthorized from '../pages/Unauthorized'
import AddVideo from '../pages/Admin/AddVideo'
export const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"",
        element:<Home/>,
      },
      {
        path:"/courses",
        element:<Courses/>,
      },
      {
        path:"admin",
        element:<AdminLogin />,
      },
      {
        path:"/adminName",
        element:<Admin/>,
      },
      {
        path:"/adminName/Courses",
        element:<AdminCourses/>,
      },
      {
        path:"/adminName/addCourse",
        element:<AddCourse/>
      },
      {
        path:"/admin/edit",
        element:<EditCourse/>
      },
      {
        path:"/adminName/editProfile",
        element:<EditInfo/>
      },
      {
        path:"/unauthorized",
        element:<Unauthorized/>
      },
      {
        path:"/adminName/:courseId/add-video",
        element:<AddVideo/>
      }
    ]
  }
])
