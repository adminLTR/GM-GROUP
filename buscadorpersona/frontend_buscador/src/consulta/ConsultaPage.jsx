import React, { useState, useEffect } from 'react';
import { Search, User, Building, Calendar, Phone, MapPin, Flag, Map, Home, AlertCircle } from 'lucide-react';

const BuscadorPersonas = () => {
  // Estados principales
  const [tipoPersona, setTipoPersona] = useState('');
  const [documento, setDocumento] = useState('');
  const [documentoValido, setDocumentoValido] = useState(true);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [pais, setPais] = useState('Uruguay');
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  
  // Estados para resultados
  const [resultados, setResultados] = useState({});
  const [resultadosGoogle, setResultadosGoogle] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);
  const [error, setError] = useState(null);

  // API URL - configúrala según tu entorno
  const API_URL = 'http://localhost:8000'; // Cambia esto según donde se ejecute tu API

  // Validar documento según tipo y país
  useEffect(() => {
    if (!documento || !tipoPersona || pais.toLowerCase() !== 'uruguay') {
      setDocumentoValido(true);
      return;
    }

    const documentoLimpio = documento.replace(/\./g, '').replace(/-/g, '');
    
    if (tipoPersona === 'Física') {
      // Solo verificamos longitud en frontend, la validación real se hace en backend
      setDocumentoValido(documentoLimpio.length >= 7 && documentoLimpio.length <= 8);
    } else if (tipoPersona === 'Jurídica') {
      // Solo verificamos longitud en frontend, la validación real se hace en backend
      setDocumentoValido(documentoLimpio.length >= 11 && documentoLimpio.length <= 12);
    }
  }, [documento, tipoPersona, pais]);

  // Función para realizar petición a la API
  const realizarPeticionAPI = async (datosFormulario) => {
    try {
      setError(null);
      setCargando(true);
      
      const respuesta = await fetch(`${API_URL}/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosFormulario)
      });
      
      if (!respuesta.ok) {
        throw new Error(`Error en la petición: ${respuesta.status}`);
      }
      
      const datos = await respuesta.json();
      setResultados(datos.resultados || {});
      setResultadosGoogle(datos.google || []);
      setBusquedaRealizada(true);
    } catch (err) {
      console.error('Error en la petición:', err);
      setError(`Error al realizar la búsqueda: ${err.message}`);
      setResultados({});
      setResultadosGoogle([]);
    } finally {
      setCargando(false);
    }
  };

  // Buscar por documento
  const buscarPorDocumento = () => {
    if (!documento || !documentoValido) return;
    
    const documentoLimpio = documento.replace(/\./g, '').replace(/-/g, '');
    const esCedula = tipoPersona === 'Física' || (documentoLimpio.length <= 8);
    const esRut = tipoPersona === 'Jurídica' || (documentoLimpio.length > 8);
    
    // Configuramos el tipo de búsqueda
    const datosFormulario = {
      tipo_persona: tipoPersona,
      pais: pais,
      busqueda_exacta: true // Indicador para buscar coincidencia exacta
    };
    
    // Agregamos el documento según su tipo
    if (esCedula) {
      datosFormulario.cedula = documentoLimpio;
    } else if (esRut) {
      datosFormulario.rut = documentoLimpio;
      // Para RUT solo queremos buscar en proveedores del estado
      datosFormulario.solo_proveedores = true;
    }
    
    realizarPeticionAPI(datosFormulario);
  };

  // Función principal de búsqueda
  const realizarBusqueda = () => {
    // Preparar los datos del formulario para enviar a la API
    const documentoLimpio = documento ? documento.replace(/\./g, '').replace(/-/g, '') : '';
    const esCedula = tipoPersona === 'Física' || (documentoLimpio && documentoLimpio.length <= 8);
    const esRut = tipoPersona === 'Jurídica' || (documentoLimpio && documentoLimpio.length > 8);
    
    const datosFormulario = {
      nombre: nombreCompleto,
      telefono: telefono,
      direccion: direccion,
      fecha_nacimiento: fechaNacimiento,
      pais: pais,
      departamento: departamento,
      ciudad: ciudad,
      tipo_persona: tipoPersona
    };
    
    // Agregamos el documento según su tipo
    if (documentoLimpio) {
      if (esCedula) {
        datosFormulario.cedula = documentoLimpio;
      } else if (esRut) {
        datosFormulario.rut = documentoLimpio;
        // Para RUT solo queremos buscar en proveedores del estado
        if (!nombreCompleto && !telefono && !direccion) {
          datosFormulario.solo_proveedores = true;
        }
      }
    }
    
    realizarPeticionAPI(datosFormulario);
  };

  // Seleccionar una persona de los resultados
  const seleccionarPersona = (persona, tipo) => {
    setPersonaSeleccionada({...persona, tipo_resultado: tipo});
    
    // Actualizar campos del formulario con datos seleccionados
    if (tipo === 'personas') {
      setNombreCompleto(`${persona.nombre} ${persona.apellido || ''}`);
      setDocumento(persona.cedula || '');
      setTelefono(persona.telefono || '');
      setDireccion(persona.direccion || '');
      setCiudad(persona.ciudad || '');
      setDepartamento(persona.departamento || '');
    } else if (tipo === 'contactos_internos') {
      if (persona.nombre_contacto_interno) {
        setNombreCompleto(persona.nombre_contacto_interno || '');
      } else {
        setNombreCompleto(`${persona.nombre} ${persona.apellido || ''}`);
      }
      setTelefono(persona.telefono_contacto_interno || persona.telefono || '');
      // No actualizar otros campos ya que el contacto interno está vinculado a otra entidad
    } else if (tipo === 'empresas_uruguay') {
      setNombreCompleto(persona.nombre_empresa || '');
      setDocumento(persona.rut || '');
      setTelefono(persona.telefono || '');
      setDireccion(persona.direccion || '');
      setCiudad(persona.localidad || '');
      setDepartamento(persona.departamento || '');
    } else if (tipo === 'proveedores_estado') {
      setNombreCompleto(persona.denominacion_social || '');
      setDocumento(persona.rut || '');
      setTelefono(persona.telefono || '');
      setDireccion(persona.domicilio || '');
      setDepartamento(persona.departamento || '');
    }
  };

  // Limpia el formulario
  const limpiarFormulario = () => {
    setTipoPersona('');
    setDocumento('');
    setNombreCompleto('');
    setTelefono('');
    setDireccion('');
    setFechaNacimiento('');
    setPais('Uruguay');
    setDepartamento('');
    setCiudad('');
    setResultados({});
    setResultadosGoogle([]);
    setBusquedaRealizada(false);
    setPersonaSeleccionada(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center justify-center">
          <Search className="mr-2" size={32} /> 
          Buscador de Personas
        </h1>
        <p className="text-gray-600">Sistema de localización de personas físicas y jurídicas</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de formulario */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Datos de búsqueda</h2>
          
          {/* Selección de tipo de persona */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Tipo de Persona</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className={`flex items-center justify-center p-4 rounded-lg border ${tipoPersona === 'Física' ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setTipoPersona('Física')}
              >
                <User className="mr-2" />
                <span>Física</span>
              </button>
              <button 
                className={`flex items-center justify-center p-4 rounded-lg border ${tipoPersona === 'Jurídica' ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setTipoPersona('Jurídica')}
              >
                <Building className="mr-2" />
                <span>Jurídica</span>
              </button>
            </div>
          </div>

          {tipoPersona && (
            <>
              {/* Campo de documento */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">
                  {tipoPersona === 'Física' ? 'Cédula' : 'RUT'}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className={`w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 ${!documentoValido ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
                    placeholder={tipoPersona === 'Física' ? '1.234.567-8' : '12.345.678/9012'}
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                  />
                  <button
                    className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 flex items-center"
                    onClick={buscarPorDocumento}
                    disabled={!documentoValido || !documento}
                  >
                    <Search size={18} />
                  </button>
                </div>
                {!documentoValido && (
                  <p className="text-red-500 text-sm mt-1">
                    Documento inválido para {pais}
                  </p>
                )}
              </div>

              {/* Demás campos de búsqueda */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    {tipoPersona === 'Física' ? 'Nombre Completo' : 'Razón Social'}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                  />
                </div>

                {tipoPersona === 'Física' && (
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Fecha de nacimiento
                    </label>
                    <div className="flex items-center">
                      <Calendar className="text-gray-400 mr-2" size={20} />
                      <input
                        type="date"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Teléfono
                  </label>
                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-2" size={20} />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="099123456"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Dirección
                  </label>
                  <div className="flex items-center">
                    <MapPin className="text-gray-400 mr-2" size={20} />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    País
                  </label>
                  <div className="flex items-center">
                    <Flag className="text-gray-400 mr-2" size={20} />
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={pais}
                      onChange={(e) => setPais(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Departamento
                    </label>
                    <div className="flex items-center">
                      <Map className="text-gray-400 mr-2" size={20} />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={departamento}
                        onChange={(e) => setDepartamento(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      Ciudad
                    </label>
                    <div className="flex items-center">
                      <Home className="text-gray-400 mr-2" size={20} />
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                  onClick={realizarBusqueda}
                  disabled={cargando}
                >
                  {cargando ? 'Buscando...' : 'Buscar'}
                  {!cargando && <Search className="ml-2" size={18} />}
                </button>
                <button
                  className="w-1/3 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300"
                  onClick={limpiarFormulario}
                >
                  Limpiar
                </button>
              </div>
            </>
          )}
        </div>

        {/* Panel de resultados */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {!tipoPersona ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
              <Search size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Seleccione un tipo de persona</h3>
              <p>Para comenzar la búsqueda, primero elija si desea buscar una persona física o jurídica</p>
            </div>
          ) : !busquedaRealizada ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
              <Search size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">No hay resultados aún</h3>
              <p>Complete los campos y presione "Buscar" para obtener resultados</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-blue-700">Resultados de la búsqueda</h2>
              
              {/* Resultados de bases de datos */}
              {Object.keys(resultados).length > 0 ? (
                <div className="mb-6">
                  {Object.entries(resultados).map(([tipo, coincidencias]) => (
                    <div key={tipo} className="mb-6">
                      <h3 className={`text-lg font-medium mb-2 flex items-center p-2 rounded-t-lg ${
                        tipo === 'contactos_internos' ? 'bg-purple-100 text-purple-800' :
                        tipo === 'empresas_uruguay' ? 'bg-blue-100 text-blue-800' :
                        tipo === 'proveedores_estado' ? 'bg-green-100 text-green-800' :
                        tipo === 'personas' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100'
                      }`}>
                        {tipo === 'contactos_internos' ? (
                          <User className="mr-2" size={20} />
                        ) : tipo === 'empresas_uruguay' ? (
                          <Building className="mr-2" size={20} />
                        ) : tipo === 'proveedores_estado' ? (
                          <Building className="mr-2" size={20} />
                        ) : (
                          <User className="mr-2" size={20} />
                        )}
                        {tipo === 'contactos_internos' ? 'Contactos Internos' :
                         tipo === 'empresas_uruguay' ? 'Empresas del Uruguay' :
                         tipo === 'proveedores_estado' ? 'Proveedores del Uruguay' :
                         tipo === 'personas' ? 'Personas Físicas' : tipo.replace(/_/g, ' ').toUpperCase()}
                        ({coincidencias.length})
                      </h3>
                      
                      <div className="space-y-3 mb-4 border border-t-0 border-gray-200 p-3 rounded-b-lg">
                        {coincidencias.map((item, index) => (
                          <div 
                            key={index} 
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              personaSeleccionada && personaSeleccionada.tipo_resultado === tipo && 
                              ((tipo === 'personas' && personaSeleccionada.cedula === item.cedula) ||
                               (tipo === 'contactos_internos' && personaSeleccionada.id === item.id) ||
                               (tipo !== 'personas' && tipo !== 'contactos_internos' && 
                                (personaSeleccionada.nombre_empresa === item.nombre_empresa ||
                                 personaSeleccionada.denominacion_social === item.denominacion_social)))
                              ? (
                                tipo === 'contactos_internos' ? 'bg-purple-50 border-purple-300' :
                                tipo === 'empresas_uruguay' ? 'bg-blue-50 border-blue-300' :
                                tipo === 'proveedores_estado' ? 'bg-green-50 border-green-300' :
                                'bg-indigo-50 border-indigo-300'
                              ) : 'hover:bg-gray-50 border-gray-200'
                            }`}
                            onClick={() => seleccionarPersona(item, tipo)}
                          >
                            {tipo === 'contactos_internos' ? (
                              <div>
                                <div className="font-medium text-purple-800">{item.nombre_contacto_interno || item.nombre}</div>
                                <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-x-2">
                                  <div>📞 {item.telefono_contacto_interno || item.telefono}</div>
                                  <div className="text-purple-600 font-medium">Tipo: {item.tipo_contacto_interno}</div>
                                  <div className="col-span-2 mt-1 text-xs text-gray-500">
                                    Vinculado a: {item.nombre} {item.apellido || ''} {item.cedula ? `(${item.cedula})` : ''}
                                  </div>
                                </div>
                              </div>
                            ) : tipo === 'personas' ? (
                              <div>
                                <div className="font-medium text-indigo-800">{item.nombre} {item.apellido || ''}</div>
                                <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-x-2">
                                  <div>🪪 {item.cedula || 'No registrada'}</div>
                                  <div>📞 {item.telefono || 'No registrado'}</div>
                                  <div className="col-span-2">🏠 {item.direccion || 'No registrada'}</div>
                                  <div>{[item.ciudad, item.departamento].filter(Boolean).join(', ') || 'Ubicación no registrada'}</div>
                                </div>
                              </div>
                            ) : tipo === 'empresas_uruguay' ? (
                              <div>
                                <div className="font-medium text-blue-800">{item.nombre_empresa}</div>
                                <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-x-2">
                                  <div>🪪 RUT: {item.rut || 'No registrado'}</div>
                                  <div>📞 {item.telefono || 'No registrado'}</div>
                                  <div className="col-span-2">🏠 {item.direccion || 'No registrada'}</div>
                                  <div>{[item.localidad, item.departamento].filter(Boolean).join(', ') || 'Ubicación no registrada'}</div>
                                </div>
                              </div>
                            ) : tipo === 'proveedores_estado' ? (
                              <div>
                                <div className="font-medium text-green-800">{item.denominacion_social}</div>
                                <div className="text-sm text-gray-600 mt-1 grid grid-cols-2 gap-x-2">
                                  <div>🪪 RUT: {item.rut || 'No registrado'}</div>
                                  <div>📞 {item.telefono || 'No registrado'}</div>
                                  <div className="col-span-2">🏠 {item.domicilio || 'No registrado'}</div>
                                  <div>{item.departamento || 'Departamento no registrado'}</div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="font-medium">{item.nombre || item.nombre_empresa || item.denominacion_social}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {Object.entries(item).filter(([key]) => 
                                    !['id', 'tipo'].includes(key)
                                  ).map(([key, value], i) => (
                                    <div key={i}>{key.replace(/_/g, ' ')}: {value || 'No registrado'}</div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                  No se encontraron coincidencias en las bases de datos.
                </div>
              )}
              
              {/* Resultados de Google */}
              {resultadosGoogle.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <svg className="mr-2 text-blue-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2v10l4.5 4.5" />
                    </svg>
                    Resultados de Google ({resultadosGoogle.length})
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <ul className="space-y-2">
                      {resultadosGoogle.map((url, index) => (
                        <li key={index} className="text-blue-600 hover:underline">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Mensaje de error */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                  <AlertCircle className="mr-2 flex-shrink-0" />
                  <div>{error}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuscadorPersonas;