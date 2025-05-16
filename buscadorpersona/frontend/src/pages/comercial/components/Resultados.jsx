import { Mail, CheckSquare, Square } from 'lucide-react';
import { useState } from "react";

export default function Resultados({
    empresas,
    loading,
    setLoading,
    handleEnviarEmails,
    filtros
}) {

    const [selectedEmpresas, setSelectedEmpresas] = useState([]);

    const toggleSelectAll = () => {
        if (selectedEmpresas.length === empresas.length) {
            setSelectedEmpresas([]);
        } else {
            setSelectedEmpresas(empresas.map(e => e.id));
        }
    };

    const toggleSelectEmpresa = (id) => {
        if (selectedEmpresas.includes(id)) {
            setSelectedEmpresas(selectedEmpresas.filter(e => e !== id));
        } else {
            setSelectedEmpresas([...selectedEmpresas, id]);
        }
    };

    
    
    return <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Resultados ({empresas.length})</h3>
            <div 
            className="flex items-center gap-2 text-indigo-600 cursor-pointer"
            onClick={toggleSelectAll}
            >
            {selectedEmpresas.length === empresas.length ? (
                <CheckSquare size={18} />
            ) : (
                <Square size={18} />
            )}
            <span>{selectedEmpresas.length === empresas.length ? 'Deseleccionar todas' : 'Seleccionar todas'}</span>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seleccionar
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departamento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {empresas.map((empresa) => (
                <tr key={empresa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSelectEmpresa(empresa.id)}
                    >
                        {selectedEmpresas.includes(empresa.id) ? (
                        <CheckSquare size={18} className="text-indigo-600" />
                        ) : (
                        <Square size={18} className="text-gray-400" />
                        )}
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{empresa.nombre_empresa}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{empresa.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{empresa.departamento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{empresa.actividad_economica}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{empresa.localidad}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{empresa.telefono}</div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {/* Botón para enviar emails y crear en kanban */}
        <div className="mt-6 flex justify-center">
            <button 
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-500 flex items-center gap-2 disabled:opacity-50"
                onClick={()=>handleEnviarEmails(selectedEmpresas, setSelectedEmpresas, setLoading, filtros)}
                disabled={selectedEmpresas.length === 0 || loading}
                >
                <Mail size={20} />
                {loading ? 'Enviando...' : `Enviar Email + Crear en Kanban (${selectedEmpresas.length})`}
            </button>
        </div>
        </div>
}