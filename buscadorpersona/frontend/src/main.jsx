import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./Home"
import Layout from "./Layout"
import ConsultaPage from "./consulta/ConsultaPage"
import ComercialPage from "./comercial/ComercialPage"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './login/Login'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter([
      {
        path: '/',
        element: <Layout/>,
        children: [
          {
            index: true,
            element: <Home/>
          },
          {
            path: '/consulta',
            element: <ConsultaPage/>
          },
          {
            path: '/comercial',
            element: <ComercialPage/>
          },
        ]
      },
      {
        path: "/login",
        element: <LoginPage/>
      }
    ])}/>
  </StrictMode>,
)
