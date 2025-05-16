import { useState, useEffect } from 'react';
import Header from './components/Header';
import FiltroTab from './components/FiltroTab';
import KanbanTab from './components/KanbanTab';
import ModalKanban from './components/ModalKanban';

// Main App Component
const ComercialPage = () => {
  const [activeTab, setActiveTab] = useState('filter');
  
  const [usuarios, setUsuarios] = useState([])
  const [selectedUser, setSelectedUser] = useState(sessionStorage.getItem("username"));
  const [disabledSelect, setDisabledSelect] = useState(true);
  
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch initial data from API
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
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

  // Mover tarjeta entre columnas con actualización a la API
  const moveCard = async (empresa, targetColumn) => {
    try {
      // Identificar columna actual
      let currentColumn = empresa.estado;
      
      if (!currentColumn || currentColumn === targetColumn) return;
      
      // Actualizar localmente primero para una mejor experiencia de usuario
      const updatedKanban = {...kanbanData};
      
      // Remove from current column
      console.log(kanbanData)
      console.log({...kanbanData})
      console.log(updatedKanban)
      
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

  const handleEnviarEmails = async (selectedEmpresas, setSelectedEmpresas, setLoading, filtros) => {
      if (selectedEmpresas.length === 0) {
          alert('Debe seleccionar al menos una empresa');
          return;
      }

      setLoading(true);
      
      try {
          // Preparamos los datos para enviar a la API
          const empresasIds = selectedEmpresas;
          const payload = {
              departamento: filtros.departamentos,
              actividad_economica: filtros.actividades,
              empresas_ids: empresasIds,
              responsable: sessionStorage.getItem('username'),
              campana_id: 123 // Aquí podrías tener un campo para seleccionar la campaña
          };
          console.log(payload)
          
          // Llamada a la API para enviar emails y crear en kanban
          const response = await fetch(API_URL + '/kanban/enviar-emails', {
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
          <FiltroTab
          handleEnviarEmails={handleEnviarEmails}/>
        ) : (
          <KanbanTab 
            kanbanData = {kanbanData} 
            columnTitles = {columnTitles} 
            usuarios = {usuarios} 
            selectedUser = {selectedUser} 
            setSelectedUser = {setSelectedUser} 
            disabledSelect = {disabledSelect} 
            openEmpresaModal = {openEmpresaModal}
          />
        )}
      </main>

      {/* Modal de Empresa */}
      {modalVisible && selectedEmpresa && (
        <ModalKanban
          setModalVisible = {setModalVisible}
          selectedEmpresa = {selectedEmpresa}
          updateResponsable = {updateResponsable}
          moveCard = {moveCard}
          columnTitles = {columnTitles}
          addComentario = {addComentario}
        />
      )}
    </div>
  );
};

export default ComercialPage;