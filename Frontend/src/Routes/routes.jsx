import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../Layout'
import Login from '../pages/Login'
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
        path:"user",
        element:<Login/>,
        // children:[
        //   {
        //     path:"/signup",
        //     element:<Login/>
        //   },
        //   {
        //     path:"/signup",
        //     element:<Login/>
        //   }
        // ]
      },
      // {
      //   path:"seller",
      //   element:<Seller/>,
      //   children:[
      //     {
      //       path:"/signup",
      //       element:<sellerSignup/>
      //     },
      //     {
      //       path:"/signup",
      //       element:<sellerLogin/>
      //     }
      //   ]
      // }
    ]
  }
])
