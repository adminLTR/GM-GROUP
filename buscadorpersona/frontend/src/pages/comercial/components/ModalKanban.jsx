import { ChevronDown, Edit } from 'lucide-react';


export default function ModalKanban({
    setModalVisible,
    selectedEmpresa,
    updateResponsable,
    moveCard,
    columnTitles,
    addComentario
}) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                        <p className="font-medium">{selectedEmpresa.usuario_responsable}</p>
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
                    value={selectedEmpresa.estado}
                    onChange={(e) => {
                      const targetColumn = e.target.value;
                      const currentColumn = selectedEmpresa.estado;
                      
                      if (currentColumn && currentColumn !== targetColumn) {
                        // const empresaToMove = kanbanData[currentColumn].find(e => e.id === selectedEmpresa.id);
                        // console.log(empresaToMove)
                        // console.log(selectedEmpresa)
                        moveCard(selectedEmpresa, targetColumn);
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
}