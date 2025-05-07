import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./Home"
import ConsultaPage from "./consulta/ConsultaPage"
import ComercialPage from "./comercial/ComercialPage"
import { createBrowserRouter, RouterProvider } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={createBrowserRouter([
      {
        path: '/',
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

    ])}/>
  </StrictMode>,
)
