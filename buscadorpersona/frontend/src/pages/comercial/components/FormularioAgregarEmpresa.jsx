import { useState } from 'react';
import { SearchSelect } from "./Selects";

export default function FormularioAgregarEmpresa({ departamentos, actividades, onSubmit }) {
    const [formData, setFormData] = useState({
        nombre_empresa: '',
        departamento: '',
        direccion: '',
        actividad_economica: '',
        email: '',
        telefono: '',
        pagina_web: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        onSubmit(formData); // Puedes manejar esto en el componente padre
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-md border">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de Empresa</label>
                <input
                    type="text"
                    name="nombre_empresa"
                    value={formData.nombre_empresa}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Dirección de Empresa</label>
                <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Departamento</label>               
                <SearchSelect
                    label={"departamento"}
                    values={departamentos.map(d=>d.nombre_departamento)}
                    onChange={(selected) => {
                        setFormData({...formData, departamento:selected.value})
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Actividad Económica</label>
                <SearchSelect
                    label={"actividad"}
                    values={actividades.map(a=>a.nombre)}
                    onChange={(selected) => {
                        setFormData({...formData, actividad_economica:selected.value})
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Página Web</label>
                <input
                    type="url"
                    name="pagina_web"
                    value={formData.pagina_web}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
                Agregar Empresa
            </button>
        </form>
    );
}
