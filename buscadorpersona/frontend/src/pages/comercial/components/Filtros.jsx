import Select from 'react-select';
import { ChevronDown } from 'lucide-react';

function MultipleSelect({values, label, filtros, setFiltros}) {
    const options = values.map(val => ({
        value: val,
        label: val
    }));

    return (
        <div className="w-full p-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none">
            
            <Select
                options={options}
                onChange={(selected) => {
                    setFiltros({ ...filtros, [label.toLowerCase()]: selected.map(opt => opt.value).join('|') });
                    console.log(filtros)
                }}
                placeholder={"Seleccionar " + label.toLowerCase() + "..."}
                isSearchable
                isMulti
            />
        </div>
    );
}

export default function Filtros({filtros, setFiltros, departamentos, actividades}) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
            <div className="relative">
                <MultipleSelect 
                    values={departamentos.map(d => d.nombre_departamento)}
                    label={"departamentos"}
                    filtros={filtros}
                    setFiltros={setFiltros}
                />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Actividad Económica</label>
            <div className="relative">
                <MultipleSelect
                    values={actividades.map(a=>a.nombre)}
                    label={"actividades"}
                    filtros={filtros}
                    setFiltros={setFiltros}
                />
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