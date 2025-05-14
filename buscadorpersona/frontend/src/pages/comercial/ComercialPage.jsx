import { useState, useEffect } from 'react';
import { Search, Mail, ChevronDown, User, Phone, MapPin, MessageSquare, Edit, CheckSquare, Square } from 'lucide-react';
import UserSelect from "./components/UserSelect"
import Header from './components/Header';
import Filtros from './components/Filtros';
import Button from '../../components/Button';

// Main App Component
const ComercialPage = () => {
  const [activeTab, setActiveTab] = useState('filter');
  const [selectedEmpresas, setSelectedEmpresas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([])
  const [selectedUser, setSelectedUser] = useState(sessionStorage.getItem("username"));
  const [disabledSelect, setDisabledSelect] = useState(true);
  const [departamentos, setDepartamentos] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [filtros, setFiltros] = useState({
    departamento: '',
    actividad_economica: '',
    fecha_desde: '',
    fecha_hasta: '',
    nombre_empresa: ''
  });
  const [kanbanData, setKanbanData] = useState({});
  const [columnTitles, setColumnTitles] = useState({
    email_enviado: 'Email Enviado',
    primer_llamado: 'Primer Llamado',
    reunion: 'Reunión',
    envio_propuesta: 'Envío Propuesta',
    seguimiento: 'Seguimiento',
    envio_contrato: 'Envío Contrato',
    contrato_los_servicios: 'Contrato de Servicios',
    finalizado: 'Finalizado'
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Get departamentos from API
        const resDepartamentos = await fetch(API_URL + '/departamentos');
        if (resDepartamentos.ok) {
          const departamentosData = await resDepartamentos.json();
          setDepartamentos(departamentosData.departamentos);
        } else {
          console.error('Error fetching departamentos');
        }
        
        // Get actividades from API
        const resActividades = await fetch(API_URL + '/actividades');
        if (resActividades.ok) {
          const actividadesData = await resActividades.json();
          setActividades(actividadesData.actividades);
        } else {
          console.error('Error fetching actividades');
        }
        
        const resUsuarios = await fetch(API_URL + '/get_users');
        if (resUsuarios.ok) {
          const usuariosData = await resUsuarios.json();
          setUsuarios(usuariosData.users);
        } else {
          console.error('Error fetching usuarios');
        }
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Initialize with empty data if APIs fail
        setKanbanData({
          email_enviado: [],
          primer_llamado: [],
          reunion: [],
          envio_propuesta: [],
          seguimiento: [],
          envio_contrato: [],
          contrato_los_servicios: [],
          finalizado: []
        });
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resKanban = await fetch(API_URL + '/kanban/listar?username=' + selectedUser);
        if (resKanban.ok) {
          const kanbanData = await resKanban.json();
          setKanbanData(kanbanData.tablero);
          setDisabledSelect(!kanbanData.es_superuser)
        } else {
          // If API fails, initialize with empty columns
          setKanbanData({
            email_enviado: [],
            primer_llamado: [],
            reunion: [],
            envio_propuesta: [],
            seguimiento: [],
            envio_contrato: [],
            contrato_los_servicios: [],
            finalizado: []
          });
          setDisabledSelect(true)
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Initialize with empty data if APIs fail
        setKanbanData({
          email_enviado: [],
          primer_llamado: [],
          reunion: [],
          envio_propuesta: [],
          seguimiento: [],
          envio_contrato: [],
          contrato_los_servicios: [],
          finalizado: []
        });
      }
    };
    fetchInitialData()
  }, [selectedUser]);

  // Buscar empresas desde la API
  const handleBuscarEmpresas = async () => {
    if (!filtros.departamento && !filtros.actividad_economica && !filtros.nombre_empresa && !filtros.fecha_desde && !filtros.fecha_hasta) {
      alert('Por favor ingrese al menos un criterio de búsqueda');
      return;
    }
    
    setLoading(true);
    
    try {
      // Construimos los parámetros de búsqueda
      const params = new URLSearchParams();
      
      if (filtros.departamento) params.append('departamento', filtros.departamento);
      if (filtros.actividad_economica) params.append('actividad_economica', filtros.actividad_economica);
      if (filtros.nombre_empresa) params.append('nombre_empresa', filtros.nombre_empresa);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      
      // Llamada a la API de empresas
      const response = await fetch(API_URL + `/empresas/filtrar?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setEmpresas(data.empresas);
      } else {
        console.error('Error al buscar empresas:', response.statusText);
        alert('Ocurrió un error al buscar empresas. Por favor intente nuevamente.');
      }
    } catch (error) {
      console.error('Error al buscar empresas:', error);
      alert('Ocurrió un error al buscar empresas. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Enviar emails y crear en kanban usando la API
  const handleEnviarEmails = async () => {
    if (selectedEmpresas.length === 0) {
      alert('Debe seleccionar al menos una empresa');
      return;
    }

    setLoading(true);
    
    try {
      // Preparamos los datos para enviar a la API
      const empresasIds = selectedEmpresas;
      console.log(empresasIds)
      const payload = {
        departamento: filtros.departamento,
        actividad_economica: filtros.actividad_economica,
        empresas_ids: empresasIds,
        responsable: localStorage.getItem('username'),
        campana_id: 123 // Aquí podrías tener un campo para seleccionar la campaña
      };
      
      // Llamada a la API para enviar emails y crear en kanban
      const response = await fetch(API_URL + '/enviar-emails-kanban', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Actualizamos el kanban con los nuevos datos
        const resKanban = await fetch(API_URL + '/kanban/listar?username=' + selectedUser);
        if (resKanban.ok) {
          const updatedKanbanData = await resKanban.json();
          setKanbanData(updatedKanbanData.tablero);
        }
        
        setSelectedEmpresas([]);
        setActiveTab('kanban');
        
        alert(result.mensaje || `Se enviaron ${selectedEmpresas.length} emails y se registraron en el kanban.`);
      } else {
        console.error('Error al enviar emails:', response.statusText);
        alert('Ocurrió un error al enviar los emails. Por favor intente nuevamente.');
      }
    } catch (error) {
      console.error('Error al enviar emails:', error);
      alert('Ocurrió un error al enviar los emails. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle selección de todas las empresas
  const toggleSelectAll = () => {
    if (selectedEmpresas.length === empresas.length) {
      setSelectedEmpresas([]);
    } else {
      setSelectedEmpresas(empresas.map(e => e.id));
    }
  };

  // Toggle selección de una empresa
  const toggleSelectEmpresa = (id) => {
    if (selectedEmpresas.includes(id)) {
      setSelectedEmpresas(selectedEmpresas.filter(e => e !== id));
    } else {
      setSelectedEmpresas([...selectedEmpresas, id]);
    }
  };

  // Mover tarjeta entre columnas con actualización a la API
  const moveCard = async (empresa, targetColumn) => {
    try {
      // Identificar columna actual
      let currentColumn = '';
      Object.keys(kanbanData).forEach(column => {
        if (kanbanData[column].some(e => e.id === empresa.id)) {
          currentColumn = column;
        }
      });
      
      if (!currentColumn || currentColumn === targetColumn) return;
      
      // Actualizar localmente primero para una mejor experiencia de usuario
      const updatedKanban = {...kanbanData};
      
      // Remove from current column
      Object.keys(updatedKanban).forEach(column => {
        updatedKanban[column] = updatedKanban[column].filter(e => e.id !== empresa.id);
      });
      
      // Add to target column
      if (updatedKanban[targetColumn]) {
        updatedKanban[targetColumn] = [...updatedKanban[targetColumn], empresa];
      } else {
        updatedKanban[targetColumn] = [empresa];
      }
      setKanbanData(updatedKanban);
      
      // Luego enviar la actualización a la API
      const response = await fetch(API_URL + '/kanban/mover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresa_id: empresa.empresa_id,
          // estado_anterior: currentColumn,
          usuario: selectedUser,
          nuevo_estado: targetColumn
        })
      });
      
      if (!response.ok) {
        console.error('Error al mover empresa en el kanban:', response.statusText);
        // Si hay error, podríamos revertir el cambio local
        // o recargar el kanban completo
        const resKanban = await fetch(API_URL + '/kanban/listar?username=' + selectedUser);
        if (resKanban.ok) {
          const kanbanData = await resKanban.json();
          setKanbanData(kanbanData);
        }
      }
    } catch (error) {
      console.error('Error al mover empresa en el kanban:', error);
      // Recargar el kanban para restaurar el estado correcto
      try {
        const resKanban = await fetch(API_URL + '/kanban/listar?username=' + selectedUser);
        if (resKanban.ok) {
          const kanbanData = await resKanban.json();
          setKanbanData(kanbanData);
        }
      } catch (e) {
        console.error('Error al recargar kanban:', e);
      }
    }
  };

  // Abrir modal con detalles de empresa
  const openEmpresaModal = (empresa) => {
    setSelectedEmpresa(empresa);
    setModalVisible(true);
  };

  // Añadir comentario a una empresa usando la API
  const addComentario = async (text) => {
    if (!selectedEmpresa || !text) return;
    
    try {
      const usuario = 'Usuario Actual'; // Esto podría venir de un contexto de autenticación
      
      // Primero actualizamos la UI para mejor experiencia
      const comentario = {
        texto: text,
        fecha: new Date().toLocaleDateString(),
        usuario: usuario
      };

      // Find and update the empresa in the kanban
      const updatedKanban = {...kanbanData};
      
      Object.keys(updatedKanban).forEach(column => {
        updatedKanban[column] = updatedKanban[column].map(e => {
          if (e.id === selectedEmpresa.id) {
            return {
              ...e,
              comentarios: [...e.comentarios, comentario]
            };
          }
          return e;
        });
      });
      
      setKanbanData(updatedKanban);
      
      // Update the selected empresa for the modal
      setSelectedEmpresa({
        ...selectedEmpresa,
        comentarios: [...selectedEmpresa.comentarios, comentario]
      });
      
      // Ahora enviamos a la API
      const response = await fetch('/api/kanban/agregar-comentario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresa_id: selectedEmpresa.id,
          comentario: text,
          usuario: usuario
        })
      });
      
      if (!response.ok) {
        console.error('Error al agregar comentario:', response.statusText);
        // Si hay error, podríamos revertir el cambio local o recargar
      }
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  };

  // Cambiar responsable de una empresa usando la API
  const updateResponsable = async (responsable) => {
    if (!selectedEmpresa) return;
    
    try {
      // Actualizamos la UI primero para mejor experiencia
      // Find and update the empresa in the kanban
      const updatedKanban = {...kanbanData};
      
      Object.keys(updatedKanban).forEach(column => {
        updatedKanban[column] = updatedKanban[column].map(e => {
          if (e.id === selectedEmpresa.id) {
            return {
              ...e,
              responsable
            };
          }
          return e;
        });
      });
      
      setKanbanData(updatedKanban);
      
      // Update the selected empresa for the modal
      setSelectedEmpresa({
        ...selectedEmpresa,
        responsable
      });
      
      // Ahora enviamos a la API
      const response = await fetch('/api/kanban/actualizar-responsable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empresa_id: selectedEmpresa.id,
          responsable: responsable
        })
      });
      
      if (!response.ok) {
        console.error('Error al actualizar responsable:', response.statusText);
        // Si hay error, podríamos revertir el cambio local o recargar
      }
    } catch (error) {
      console.error('Error al actualizar responsable:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab}/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'filter' ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Filtrar Empresas</h2>
            
            {/* Filtros */}
            <Filtros 
              filtros={filtros}
              setFiltros={setFiltros}
              departamentos={departamentos}
              actividades={actividades}
            />
            
            <div className="flex justify-center mb-6">
              {/* <Button onClick={handleBuscarEmpresas}
                disabled={(!filtros.departamento && !filtros.actividad_economica) || loading}>
                <Search size={20} />
                {loading ? 'Buscando...' : 'Buscar Empresas'}
              </Button> */}
              <button 
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-500 flex items-center gap-2 disabled:opacity-50"
                onClick={handleBuscarEmpresas}
                disabled={(!filtros.departamento && !filtros.actividad_economica) || loading}
              >
                <Search size={20} />
                {loading ? 'Buscando...' : 'Buscar Empresas'}
              </button>
            </div>
            
            {/* Tabla de resultados */}
            {empresas.length > 0 && (
              <div className="mt-6">
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
                    onClick={handleEnviarEmails}
                    disabled={selectedEmpresas.length === 0 || loading}
                  >
                    <Mail size={20} />
                    {loading ? 'Enviando...' : `Enviar Email + Crear en Kanban (${selectedEmpresas.length})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Tablero Kanban</h2>
              <UserSelect
                users={usuarios}
                value={selectedUser}
                onChange={setSelectedUser}
                isDisabled={disabledSelect}
              />
            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 min-h-screen">
              {Object.keys(columnTitles).map((column) => {
                
                return (
                  <div key={column} className="flex-shrink-0 w-72 bg-gray-100 rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">{columnTitles[column]}</h3>
                      <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                        {kanbanData[column]?kanbanData[column].length:0}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {kanbanData[column] && kanbanData[column].map((empresa) => (
                        <div 
                          key={empresa.kanban_id} 
                          className="bg-white p-3 rounded-md shadow cursor-pointer hover:shadow-md"
                          onClick={() => openEmpresaModal(empresa)}
                        >
                          <h4 className="font-medium text-gray-900 mb-2">{empresa.nombre_empresa}</h4>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              <span>{empresa.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              <span>{empresa.telefono}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{empresa.localidad}, {empresa.departamento}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User size={14} />
                              <span>Resp: {empresa.usuario_responsable}</span>
                            </div>
                          </div>
                          
                          {empresa.comentario && empresa.comentario.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                              <div className="flex items-start gap-1">
                                <MessageSquare size={14} className="mt-1 flex-shrink-0" />
                                <span>{empresa.comentarios[empresa.comentarios.length - 1].texto}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modal de Empresa */}
      {modalVisible && selectedEmpresa && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">{selectedEmpresa.nombre_empresa}</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setModalVisible(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              {/* Detalles de la empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{selectedEmpresa.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Teléfono:</span>
                      <p className="font-medium">{selectedEmpresa.telefono}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ubicación:</span>
                      <p className="font-medium">{selectedEmpresa.localidad}, {selectedEmpresa.departamento}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Actividad Económica:</span>
                      <p className="font-medium">{selectedEmpresa.actividad_economica}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Responsable:</span>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{selectedEmpresa.responsable}</p>
                        <button 
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => {
                            const newResponsable = prompt('Ingrese el nombre del nuevo responsable:', selectedEmpresa.responsable);
                            if (newResponsable) updateResponsable(newResponsable);
                          }}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Fecha de creación:</span>
                      <p className="font-medium">{selectedEmpresa.fecha_creacion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estado actual y cambio de estado */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado actual:</label>
                <div className="relative">
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    value={Object.keys(kanbanData).find(key => 
                      kanbanData[key].some(e => e.id === selectedEmpresa.id)
                    ) || ''}
                    onChange={(e) => {
                      const targetColumn = e.target.value;
                      const currentColumn = Object.keys(kanbanData).find(key => 
                        kanbanData[key].some(e => e.id === selectedEmpresa.id)
                      );
                      
                      if (currentColumn && currentColumn !== targetColumn) {
                        const empresaToMove = kanbanData[currentColumn].find(e => e.id === selectedEmpresa.id);
                        console.log(empresaToMove)
                        moveCard(empresaToMove, targetColumn);
                      }
                      
                      setModalVisible(false);
                    }}
                  >
                    {Object.keys(columnTitles).map((column) => {
                      return (
                        <option key={column} value={column}>
                          {columnTitles[column]}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={20} />
                </div>
              </div>
              
              {/* Comentarios */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Historial de comentarios</h4>
                
                <div className="space-y-4 mb-4 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-md">
                  {selectedEmpresa.comentarios && selectedEmpresa.comentarios.length > 0 ? (
                    selectedEmpresa.comentarios.map((comentario, index) => (
                      <div key={index} className="pb-3 border-b border-gray-200 last:border-0">
                        <div className="text-sm">{comentario.texto}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                          <span>{comentario.usuario}</span>
                          <span>{comentario.fecha}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No hay comentarios para mostrar.</div>
                  )}
                </div>
                
                {/* Agregar comentario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agregar comentario:</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Escribe un comentario..."
                      id="new-comment"
                    />
                    <button 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                      onClick={() => {
                        const commentInput = document.getElementById('new-comment');
                        if (commentInput && commentInput.value) {
                          addComentario(commentInput.value);
                          commentInput.value = '';
                        }
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 p-6 border-t bg-gray-50">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setModalVisible(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComercialPage;