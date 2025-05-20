import { useState, useEffect } from 'react';
import Header from './components/Header';
import FiltroTab from './components/FiltroTab';
import KanbanTab from './components/KanbanTab';
import ModalKanban from './components/ModalKanban';

// Main App Component
const ComercialPage = () => {
  const [activeTab, setActiveTab] = useState('filter');
  
  const [selectedUser, setSelectedUser] = useState(sessionStorage.getItem("username"));
  const [disabledSelect, setDisabledSelect] = useState(true);
  
  const [kanbanData, setKanbanData] = useState({});
  const columnTitles = {
    email_enviado: 'Email Enviado',
    primer_llamado: 'Primer Llamado',
    reunion: 'Reunión',
    envio_propuesta: 'Envío Propuesta',
    seguimiento: 'Seguimiento',
    envio_contrato: 'Envío Contrato',
    contrato_los_servicios: 'Contrato de Servicios',
    finalizado: 'Finalizado'
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

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
  const moveCard = async (empresa, targetColumn = null, newResponsable = null, comentarios = null) => {
    try {
      // Identificar columna actual
      let currentColumn = empresa.estado;
      
      if (!currentColumn || currentColumn === targetColumn) return;
      
      // Actualizar localmente primero para una mejor experiencia de usuario
      const updatedKanban = {...kanbanData};

      // Remove from current column
      Object.keys(updatedKanban).forEach(column => {
        updatedKanban[column] = updatedKanban[column].filter(e => e.kanban_id !== empresa.kanban_id);
      });
      // Add to target column
      if (updatedKanban[targetColumn]) {
        updatedKanban[targetColumn] = [...updatedKanban[targetColumn], empresa];
      } else {
        updatedKanban[targetColumn] = [empresa];
      }
      setKanbanData(updatedKanban);
      
      // Luego enviar la actualización a la API
      const response = await fetch(API_URL + '/kanban/update/' + empresa.kanban_id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kanban_id: empresa.kanban_id,
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab}/>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'filter' ? (
          <FiltroTab 
            setKanbanData={setKanbanData}
            setActiveTab={setActiveTab}
          />
        ) : (
          <KanbanTab 
            kanbanData = {kanbanData} 
            setKanbanData={setKanbanData}
            columnTitles = {columnTitles} 
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
          columnTitles = {columnTitles}
          setSelectedEmpresa={setSelectedEmpresa}
          setKanbanData={setKanbanData}
        />
      )}
    </div>
  );
};

export default ComercialPage;