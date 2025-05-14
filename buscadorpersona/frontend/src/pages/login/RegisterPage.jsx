import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [nombres, setNombres] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [superuser, setSuperuser] = useState(false);
    const [error, setError] = useState("");
  
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(()=>{
      const token = sessionStorage.getItem("token");
      if (!token) {
        window.location.href = "/login"
      }

    }, [])
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const response = await fetch(API_URL + '/usuarios/crear', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username,
          password,
          nombres,
          email,
          telefono,
          superuser
      })
      });
      console.log(response)
      if (response.ok) {
          // const res = await response.json()
          withReactContent(Swal).fire({
              title: "Registro con exito",
              text: "Usuario registrado con exito",
              icon: "success"
          });
          window.location.href = "/";
      } else {
          withReactContent(Swal).fire({
              title: "Error al registrar",
              text: "Credenciales incorrectas",
              icon: "error"
          });
          setUsername("");
          setPassword("");
      }
    }
  
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row animate-zoom-in">
    
    {/* Imagen lateral */}
    <div className="hidden md:block md:w-1/2">
      <img
        src="/logo.jpg"
        alt="Logo Empresa"
        className="w-full h-full object-cover"
      />
    </div>

    {/* Formulario */}
    <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
      <h3 className="text-2xl font-semibold text-center text-indigo-700 mb-6 animate-slide-in-top">
        Registrar nuevo usuario
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Ingresa tu usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Ingresa tu nombre completo"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa tu correo electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
            Telefono
          </label>
          <input
            id="telefono"
            type="text"
            placeholder="Ingresa tu número de celular"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-700 transition-all duration-300"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="superuser" className="block text-sm font-medium text-gray-700">
            Superuser
          </label>
          <input
            id="superuser"
            type="checkbox"
            value={superuser}
            onChange={(e) => setSuperuser(e.target.checked)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-600 transition-all duration-300 cursor-pointer"
        >
          Registrar
        </button>

        <button
          type="button"
          onClick={()=>window.location.href="/"}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-500 mt-2 transition-all duration-300 cursor-pointer"
        >
          Cancelar
        </button>

      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  </div>
</div>
}