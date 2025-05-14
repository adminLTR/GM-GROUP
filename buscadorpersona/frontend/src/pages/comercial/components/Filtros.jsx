import { ChevronDown } from 'lucide-react';

export default function Filtros({filtros, setFiltros, departamentos, actividades}) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <div className="relative">
                <select 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                value={filtros.departamento}
                onChange={(e) => {setFiltros({...filtros, departamento: e.target.value})}}
                >
                <option value="">Seleccione un departamento</option>
                {departamentos.map(dep => (
                    <option key={dep.id_departamento} value={dep.nombre_departamento}>
                    {dep.nombre_departamento}
                    </option>
                ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={20} />
            </div>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actividad Económica</label>
            <div className="relative">
                <select 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                value={filtros.actividad_economica}
                onChange={(e) => setFiltros({...filtros, actividad_economica: e.target.value})}
                >
                <option value="">Seleccione una actividad</option>
                {actividades.map(act => (
                    <option key={act.id} value={act.nombre}>{act.nombre}</option>
                ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={20} />
            </div>
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Empresa</label>
            <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Buscar por nombre..."
                value={filtros.nombre_empresa}
                onChange={(e) => setFiltros({...filtros, nombre_empresa: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
            <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={filtros.fecha_desde}
                onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
            />
            </div>
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
            <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={filtros.fecha_hasta}
                onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
            />
        </div>
    </div>
}