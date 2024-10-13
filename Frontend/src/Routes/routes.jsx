import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from '../pages/Home'
import Layout from '../Layout'
export const router = createBrowserRouter([
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"",
        element:<Home/>,
      },
      // {
      //   path:"user",
      //   element:<User/>,
      //   children:[
      //     {
      //       path:"/signup",
      //       element:<userSignup/>
      //     },
      //     {
      //       path:"/signup",
      //       element:<userLogin/>
      //     }
      //   ]
      // },
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
