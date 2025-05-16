import { Mail, User, Phone, MapPin, MessageSquare } from 'lucide-react';

import UserSelect from "./UserSelect";

function KanbanItem({openEmpresaModal, empresa}) {
    return <div 
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
}

export default function KanbanTab({
    kanbanData, 
    columnTitles, 
    usuarios, 
    selectedUser, 
    setSelectedUser, 
    disabledSelect, 
    openEmpresaModal
}) {
    return <div className="bg-white rounded-lg shadow-md p-6">
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
                            <KanbanItem 
                                openEmpresaModal={openEmpresaModal}
                                empresa={empresa}
                            />
                        ))}
                    </div>
                </div>
            );
            })}
        </div>
    </div>
}