import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./pages/Home"
import Layout from "./pages/Layout"
import ConsultaPage from "./pages/consulta/ConsultaPage"
import ComercialPage from "./pages/comercial/ComercialPage"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './pages/login/Login'

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
