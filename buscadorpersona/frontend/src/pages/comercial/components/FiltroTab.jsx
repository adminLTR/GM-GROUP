import Filtros from './Filtros';
import Resultados from './Resultados';
import Button from '../../../components/Button'
import FormularioAgregarEmpresa from './FormularioAgregarEmpresa';

import { getDepartamentos, getActividades, getEmpresasFiltro, agregarEmpresa } from "../../../js/api";

import { Search } from 'lucide-react';
import { useState, useEffect } from "react";

export default function FiltroTab({setKanbanData, setActiveTab}) {

    const [filtros, setFiltros] = useState({
        departamentos: '',
        actividades: '',
        fecha_desde: '',
        fecha_hasta: '',
        nombre_empresa: ''
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [empresas, setEmpresas] = useState([]);
    

    useEffect(() => {
        const fetchInitData = async () => {
            const dataDepartamentos = await getDepartamentos();
            setDepartamentos(dataDepartamentos.departamentos);
            
            const dataActividades = await getActividades();
            setActividades(dataActividades.actividades);
        }
        fetchInitData();
    }, []);


    const handleBuscarEmpresas = async () => {
        if (!filtros.departamentos && !filtros.actividades && !filtros.nombre_empresa && !filtros.fecha_desde && !filtros.fecha_hasta) {
            alert('Por favor ingrese al menos un criterio de búsqueda');
            return;
        }
        
        setLoading(true);
        
        try {
            // Construimos los parámetros de búsqueda
            const params = new URLSearchParams();
            
            if (filtros.departamentos) params.append('departamentos', filtros.departamentos);
            if (filtros.actividades) params.append('actividades', filtros.actividades);
            if (filtros.nombre_empresa) params.append('nombre_empresa', filtros.nombre_empresa);
            if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
            if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
            
            // Llamada a la API de empresas
            const data = await getEmpresasFiltro(params);
            setEmpresas(data.empresas)
        } catch (error) {
            console.error('Error al buscar empresas:', error);
            alert('Ocurrió un error al buscar empresas. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };
    
    return <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Filtrar Empresas</h2>
        
        {/* Filtros */}
        <Filtros 
            filtros={filtros}
            setFiltros={setFiltros}
            departamentos={departamentos}
            actividades={actividades}
        />
        
        <div className="flex justify-center mb-6">
            <Button onClick={handleBuscarEmpresas}
            disabled={(!filtros.departamentos && !filtros.actividades) || loading}
            >
                <Search size={20} />
                {loading ? 'Buscando...' : 'Buscar Empresas'}
            </Button>
        </div>
        
        {/* Tabla de resultados o mensaje */}
        {empresas.length > 0 && (
            <Resultados
                empresas={empresas}
                loading={loading}
                setLoading={setLoading}
                filtros={filtros}
                setActiveTab={setActiveTab}
                setKanbanData={setKanbanData}
            />
        )}
        <div className="my-4">
            <FormularioAgregarEmpresa
                departamentos={departamentos}
                actividades={actividades}
                onSubmit={(data) => {
                    agregarEmpresa(data)
                }}
            />
        </div>
    </div>
}