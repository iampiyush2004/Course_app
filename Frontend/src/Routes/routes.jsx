import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../Layout'
import AdminLogin from '../pages/Admin/AdminLogin'
import Courses from '../pages/Course/Courses'
import Admin from '../pages/Admin/Admin'
import AddCourse from '../pages/Admin/AddCourse'
import AdminCourses from '../pages/Admin/AdminCourses'
import EditCourse from '../pages/Admin/EditCourse'
import EditInfo from '../pages/Admin/editInfo'
import Unauthorized from '../pages/Unauthorized'
import AddVideo from '../pages/Admin/AddVideo'
import CoursePage from '../pages/Admin/CoursePage'
import CourseInfo from '../pages/Course/CourseInfo'
import Login from '../pages/Login'
import TeacherInfo from '../pages/TeacherInfo'
import UserLogin from '../pages/User/UserLogin'
import Profile from '../pages/User/Profile'
import UserCourses from "../pages/User/UserCourses"
import EditProfile from '../pages/User/EditProfile'
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
        path:"/login",
        element:<Login/>
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
      },
      {
        path:"/courses/:courseId/videos/:videoId",
        element:<CoursePage/>
      },
      {
        path : "/courses/:course_id",
        element:<CourseInfo/>
      },
      {
        path: "/teacher/:teacher_id",
        element:<TeacherInfo/>
      },
      {
        path:"student-login",
        element:<UserLogin/>
      },
      // user
      {
        path:"user/profile",
        element:<Profile/>
      },
      {
        path:"user/courses",
        element:<UserCourses/>
      },
      {
        path:"user/editProfile",
        element:<EditProfile/>
      }
    ]
  }
])
