import { FaUserCircle } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Layout() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token || token.length <= 0) {
            navigate('/login')
        } else {
            setUsername(localStorage.getItem("username"))
        }
    }, [])

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login"
    }
    return <div>
        <header className="bg-white shadow-md w-full px-6 py-3 flex justify-between items-center">
            {/* Logo y nombre de empresa */}
            <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="h-10 w-10 object-contain" />
                <h1 className="text-xl font-bold text-gray-800">GM Group</h1>
            </div>

            {/* Usuario e icono */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                <FaUserCircle className="text-2xl" />
                <span className="font-medium">{username}</span>
                </div>
                <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md text-sm transition"
                >
                Logout
                </button>
            </div>
        </header>
        <main>
            <Outlet/>
        </main>
    </div>
}