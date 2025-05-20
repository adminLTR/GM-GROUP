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