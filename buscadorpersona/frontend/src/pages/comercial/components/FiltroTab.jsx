import Filtros from './Filtros';
import Resultados from './Resultados';
import Button from '../../../components/Button'

export default function FiltroTab({
    filtros, 
    setFiltros, 
    departamentos, 
    actividades,
    empresas, 
    handleBuscarEmpresas,
    selectedEmpresas, 
    toggleSelectAll, 
    toggleSelectEmpresa, 
    handleEnviarEmails,
    loading
}) {
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
            disabled={(!filtros.departamento && !filtros.actividad_economica) || loading}
            >
                <Search size={20} />
                {loading ? 'Buscando...' : 'Buscar Empresas'}
            </Button>
        </div>
        
        {/* Tabla de resultados */}
        {empresas.length > 0 && (
            <Resultados
            empresas={empresas}
            selectedEmpresas={selectedEmpresas}
            toggleSelectAll={toggleSelectAll}
            toggleSelectEmpresa={toggleSelectEmpresa}
            handleEnviarEmail={handleEnviarEmails}
            loading={loading}
            />
        )}
    </div>
}