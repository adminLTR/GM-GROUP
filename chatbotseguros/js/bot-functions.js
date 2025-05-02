const {
    combineGreeting,
    formatDate,
} = require("./utils.js")

const {
  getAutoData,
} = require("./cotizador.js")

const axios = require('axios');

// Función para interactuar con GPT (para respuestas generales)
async function obtenerRespuestaDeGPT(contexto, mensajeUsuario) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: contexto },
                    { role: 'user', content: mensajeUsuario }
                ],
                max_tokens: 200,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Usa process.env para la clave
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error al conectar con GPT:', error.message);
        return 'Lo siento, hubo un problema al procesar tu solicitud. Por favor, intenta nuevamente más tarde.';
    }
}

// Función para interactuar con Chroma
async function buscarEnChroma(query, corredorId) {
    try {
        const response = await fetch('http://localhost:5000/query', { // Asegúrate de que la URL sea correcta
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, corredor: corredorId }),
        });

        if (!response.ok) {
            console.error(`Error al comunicarse con el microservicio de Chroma: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data; // Array de resultados
    } catch (error) {
        console.error("Error al realizar la petición al microservicio de Chroma:", error);
        return null;
    }
}

async function botWelcomeUser(req, res, pool, corredorId) {
    try {
        const [corredorRows] = await pool.execute("SELECT nombre FROM corredores WHERE id_corredor = ?", [corredorId]);
        const corredorName = (corredorRows && corredorRows.length > 0) ? corredorRows[0].nombre : 'tu asesor';
        req.session.welcomeSent = true;
        return res.json({ 
        message: `Hola, te has comunicado con ${corredorName} para derivar tu consulta y obtener una respuesta más rápida y profesional. Por favor, selecciona del siguiente listado cuál sería tu solicitud:\n\n1. Cotizar un nuevo seguro\n2. Estado de mi seguro\n3. Cambio de Vehículo, Cambio de cobertura o cambio de matrícula\n4. Solicitar documentación\n5. Solicitar asistencia mecánica o denunciar un choque\n6. Dar de baja una póliza\n7. Horario de oficina y ubicación\n8. Otras consultas`
        });
    } catch (error) {
        // console.error('Error al obtener el nombre del corredor:', error);
        return res.json({ message: "Lo siento, hubo un error al obtener la información del asesor." });
    }
}

function detectarSaludo(userMessage) {
    let lowerMessage = userMessage.toLowerCase();
    const greetings = {
        "buenos días": "Hola, buenos días. ¿Cómo estás?",
        "buenas tardes": "Hola, buenas tardes. ¿Cómo estás?",
        "buenas noches": "Hola, buenas noches. ¿Cómo estás?",
        "hola": "Hola, ¿cómo estás?"
    };
    let greetingMessage = "";
    let userMsg = userMessage;

    for (const key in greetings) {
        if (lowerMessage.includes(key)) {
            greetingMessage = greetings[key];
            // Borramos ese fragmento del mensaje para que no interfiera en la detección posterior
            lowerMessage = lowerMessage.replace(key, "").trim();
            // Ajustamos userMessage también, por coherencia
            userMsg = userMessage.replace(new RegExp(key, "i"), "").trim();
            break;
        }
    }
    return {lowerMessage, greetingMessage, userMsg}
}

// ==================================================
//   FUNCIONES DE FLUJO
// ==================================================

async function asistenciaFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, asw=null) {
    const asistenciaKeywords = [
        "como llamo la grua", 
        "necesito una grua", 
        "requiro una grua", 
        "mandenme una grua", 
        "solicito grua", 
        "ayuda con grua", 
        "auxilio grua", 
        "urgente grua", 
        "necesito remolque", 
        "requiere remolque",
        "necesito auxilio mecanico", 
        "como llamo al auxilio mecanico", 
        "estoy sin bateria", 
        "como llamo al guinche", 
        "necesito un guinche", 
        "choque", 
        "tuve un siniestro", 
        "hola recien choque", 
        "necesito perito", 
        "urgente choque"
    ];
    
    if (asistenciaKeywords.some(keyword => normalizedMessage.includes(keyword)) ||lowerMessage === "5") {
        req.session.pendingAssistance = true;
        return res.json({ 
            message: combineGreeting(
                greetingMessage, 
                asw ? asw : "Déjame ayudarte, indícame tu número de cédula para buscar tu póliza."
            ) 
        });
    }

    // if (lowerMessage === "5") {
    //     req.session.pendingAssistance = true;
    //     return res.json({ message: combineGreeting("Por favor, indícame tu número de cédula para buscar tu póliza.") });
    // }

    // Priorizar el flujo de asistencia: si está pendiente asistencia, procesar la cédula
    if (req.session.pendingAssistance) {
        if (/^\d+$/.test(lowerMessage)) {
            req.session.pendingAssistance = false;
            const cedula = lowerMessage;
            try {
                const [personaRows] = await pool.execute("SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?", [cedula, corredorId]);
                if (personaRows.length === 0) {
                    return res.json({ 
                        message: combineGreeting(
                            greetingMessage,
                            "No se encontró persona con ese número de documento y corredor asociado."
                        )
                    });
                }
                const persona = personaRows[0];
                // Buscar únicamente pólizas activas (estado 'vigente')
                const [polizas] = await pool.execute("SELECT * FROM polizas WHERE id_persona = ? AND estado_vigencia = 'vigente'", [persona.id_persona]);
                if (polizas.length === 0) {
                    return res.json({ 
                        message: combineGreeting(
                            greetingMessage, 
                            "No se encontró ninguna póliza activa asociada a ese documento."
                        ) 
                    });
                } else if (polizas.length === 1) {
                    const poliza = polizas[0];
                    const [companiaRows] = await pool.execute("SELECT * FROM companias_seguros WHERE id_compania = ?", [poliza.id_compania]);
                    if (companiaRows.length === 0) {
                        return res.json({ 
                            message: combineGreeting(
                                greetingMessage, 
                                "No se encontró información de la compañía para esa póliza."
                            ) 
                        });
                    }
                    const compania = companiaRows[0];
                    return res.json({
                        message: combineGreeting(
                            greetingMessage, 
                            `Mira, tenés que llamar a la compañía que tenés el seguro contratado, la misma es ${compania.nombre} y su Teléfono es ${compania.telefono}.`
                        )
                    });
                } else {
                    const lista = polizas
                    .map(p => `Póliza: ${p.codigo} / ${p.referencia || 'sin referencia'} / Inicio: ${formatDate(p.fecha_inicio)} / Fin: ${formatDate(p.fecha_fin)}`)
                    .join("\n");
                    req.session.pendingPolizaSelection = true;
                    return res.json({ 
                        message: combineGreeting(
                            greetingMessage, 
                            `Estas son tus pólizas activas:\n${lista}\nPor favor, indícame en cuál póliza deseas cambiar algo.`
                        )
                    });
                }
            } catch (error) {
                console.error("Error en la consulta de asistencia:", error);
                return res.json({ message: combineGreeting(greetingMessage, "Error al procesar la solicitud, por favor inténtalo nuevamente.") });
            }
        } else {
            return res.json({ message: combineGreeting(greetingMessage, "Ese no es su número de cédula. Ingréselo sin puntos ni guiones.") });
        }
    }

    if (req.session.pendingPolizaSelection) {
        if (/^\d+$/.test(lowerMessage)) {
          req.session.pendingPolizaSelection = false;
          const codigoSeleccionado = lowerMessage;
          try {
            const [polizaRows] = await pool.execute("SELECT * FROM polizas WHERE codigo = ?", [codigoSeleccionado]);
            if (polizaRows.length === 0) {
              return res.json({ message: combineGreeting("No se encontró ninguna póliza con ese código. Por favor, inténtalo nuevamente.") });
            }
            const poliza = polizaRows[0];
            const [companiaRows] = await pool.execute("SELECT * FROM companias_seguros WHERE id_compania = ?", [poliza.id_compania]);
            if (companiaRows.length === 0) {
              return res.json({ message: combineGreeting("No se encontró información de la compañía para esa póliza.") });
            }
            const compania = companiaRows[0];
            return res.json({
              message: combineGreeting(`Mira, tenés que llamar a la compañía que tenés el seguro contratado, la misma es ${compania.nombre} y su Teléfono es ${compania.telefono}.`)
            });
          } catch (error) {
            console.error("Error en la selección de póliza:", error);
            return res.json({ message: combineGreeting("Error al procesar la solicitud, por favor inténtalo nuevamente.") });
          }
        } else {
          return res.json({ message: combineGreeting("Por favor, ingrese un número de póliza válido.") });
        }
    }

    // Bloque genérico para mensajes que son solo números y ningún otro flujo pendiente.
    if (/^\d+$/.test(lowerMessage) &&
        !req.session.pendingCotizacionStep &&
        !req.session.pendingEstadoStep &&
        !req.session.pendingChangeStep &&
        !req.session.pendingDocumentacionStep &&
        !req.session.pendingPolizaSelection) {
        try {
            const [personaRows] = await pool.execute("SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?", [lowerMessage, corredorId]);
            if (personaRows.length > 0) {
                const persona = personaRows[0];
                return res.json({ 
                    message: combineGreeting(
                        greetingMessage, 
                        `Perfecto, al brevedad ${persona.nombre} me comunico contigo para ayudarte con esto.`
                    ) 
                });
            }
        } catch (error) {
            console.error("Error al buscar la persona:", error);
        }
    }
    return null;
}

async function cotizacionFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw=null) {
    const cotizacionKeywords = [
        "cotizar seguro",
        "quiero cotizar",
        "nuevo seguro",
        "me pasas cotizacion para un seguro ",
        "contratar un seguro de un auto",
        "hacer un seguro para un auto",
        "quiero ponerle seguro a mi auto",
        "hola buenas tardes quiero ponerle un seguro a un auto",
        "quiero ponerle seguro a mi moto",
        "contratar seguro para moto",
        "cual es el precio para el seguro de un auto",
        "seguro con grua",
        "el seguro mas economico",
        "quiero un seguro para mi camioneta",
        "quiero hacer un seguro",
        "cuanto vale seguro para la moto",
        "cuanto vale seguro para la moto"
    ];
    
    if ((lowerMessage === "1" || cotizacionKeywords.some(keyword => normalizedMessage.includes(keyword))) && !req.session.pendingCotizacionStep) {
        req.session.pendingCotizacionStep = "cedula";
        req.session.cotizacionData = {};
        return res.json({ 
            message: combineGreeting(
                greetingMessage, 
                asw ? asw : "Para cotizarte, por favor indícame tu número de cédula."
            ) 
        });
    }
    
    if (req.session.pendingCotizacionStep === "cedula") {
        if (/^\d+$/.test(lowerMessage)) {
          req.session.cotizacionData.cedula = lowerMessage;
          try {
            const [personaRows] = await pool.execute("SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?", [lowerMessage, corredorId]);
            if (personaRows.length > 0) {
                // existe un cliente
                const persona = personaRows[0];
                req.session.cotizacionData = { ...req.session.cotizacionData, ...persona };
                req.session.clienteExistente = true;
                req.session.pendingCotizacionStep = "final";
                return res.json({ 
                    message: combineGreeting(
                        greetingMessage, 
                        `${persona.nombre}, para cotizarte necesito solamente que me pases la foto de la propiedad o, si no la tenés, indícame la marca, modelo y año del vehículo a cotizar.`
                    ) 
                });
            } else {
                // no existe un cliente
                req.session.clienteExistente = false;
                req.session.pendingCotizacionStep = "nombre";
                return res.json({ 
                    message: combineGreeting(
                        greetingMessage, 
                        "¿Cómo es tu nombre?"
                    ) 
                });
            }
          } catch (error) {
                console.error("Error al buscar la persona:", error);
                return res.json({ 
                    message: combineGreeting(
                        greetingMessage, 
                        "Error al procesar tu cédula. Por favor, inténtalo nuevamente."
                    ) 
                });
          }
        } else {
            return res.json({ 
                message: combineGreeting(
                    greetingMessage, 
                    "Por favor, ingresa un número de cédula válido."
                ) 
            });
        }
    }
    
    if (req.session.pendingCotizacionStep === "nombre") {
        req.session.cotizacionData.nombre = userMessage; // Guardamos literal
        req.session.pendingCotizacionStep = "fecha";
        return res.json({ 
            message: combineGreeting(
                greetingMessage, 
                "¿Cuál es tu fecha de nacimiento? "
            ) 
        });
    }
    
    if (req.session.pendingCotizacionStep === "fecha") {
        let fecha = userMessage;
        if (/^\d{4}$/.test(fecha)) {
          fecha = fecha + "-01-01";
        }
        req.session.cotizacionData.fechaNacimiento = fecha;
        req.session.pendingCotizacionStep = "final";
        return res.json({ 
            message: combineGreeting(
                greetingMessage, 
                "Por último, necesito que me envíes la foto de la propiedad o, si no la tenés, indícame la marca, modelo y año del vehículo a cotizar."
            ) 
        });
    }
    
    if (req.session.pendingCotizacionStep === "final") {
        if (userMessage.startsWith("data:")) {
            // imagen
          req.session.cotizacionData.fotoPropiedad = userMessage;
        } else {
          req.session.cotizacionData.descripcion = userMessage;
        }
        try {
            let personaId;
            if (req.session.clienteExistente) {
                personaId = req.session.cotizacionData.id_persona;
            } else {
                const docData = req.session.cotizacionData;
                const [resultPersona] = await pool.execute(
                "INSERT INTO persona (nombre, cedula, fecha_nacimiento, id_corredor) VALUES (?, ?, ?, ?)",
                [docData.nombre, docData.cedula, docData.fechaNacimiento, corredorId]
                );
                personaId = resultPersona.insertId;
            }
            await pool.execute(
                "INSERT INTO negociacion (id_persona, foto_propiedad, descripcion, estado) VALUES (?, ?, ?, ?)",
                [personaId, req.session.cotizacionData.fotoPropiedad || null, req.session.cotizacionData.descripcion || null, 'pendiente']
            );
            if (req.session.cotizacionData.descripcion) {
              const autosRows = await getAutoData(pool, req.session.cotizacionData.descripcion);
              // console.log(autosRows)
              if (autosRows.length > 0) {
                let opciones = autosRows.map((row, index) => {
                  return `${index + 1}. ${row.MarcaSura} ${row.ModeloSura} del ${row.aaaa_fabrica}`;
                }).join('\n');
                req.session.pendingCotizacionStep = "selectAuto";
                req.session.autoData = autosRows;
                return res.json({
                  message: combineGreeting(
                     greetingMessage, 
                    "¿Cuál de estos es tu vehiculo?\n" + opciones 
                  ) 
                });
              }
            }
            req.session.pendingCotizacionStep = null;
            req.session.cotizacionData = null;
            req.session.clienteExistente = null;
            req.session.autoData = null;
            return res.json({
                 message: combineGreeting(
                    greetingMessage, 
                    "A la brevedad me comunico contigo, voy a buscarte el mejor precio en las principales empresas de seguros del país."
                ) 
            });
        } catch (error) {
            console.error("Error al procesar la cotización:", error);
            return res.json({ 
                message: combineGreeting(
                    greetingMessage, 
                    "Error al procesar la información, por favor vuelve a intentarlo."
                ) 
            });
        }
    }

    if (req.session.pendingCotizacionStep === "selectAuto") {
      const autosRows = req.session.autoData;
      if (isNaN(lowerMessage) || lowerMessage < 1 || lowerMessage > autosRows.length) {
        return res.json({ 
          message: combineGreeting(
              greetingMessage, 
              "Por favor, selecciona una de las opciones de arriba"
          ) 
        });
      }
      req.session.pendingCotizacionStep = null;
      req.session.cotizacionData = null;
      req.session.clienteExistente = null;
      req.session.autoData = null;
      return res.json({ 
        message: combineGreeting(
            greetingMessage, 
            "Perfecto, ahorita te doy la cotización"
        ) 
      });
  }

    return null;
}

async function estadoFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw=null) {
    const estadoKeywords = [
        "estado de mi seguro",
        "cuando vence mi seguro",
        "tengo vigente el seguro",
        "como estoy con el seguro",
        "que seguro tengo",
        "estado seguro",
        "ver mi seguro"
    ];
    
    if ((lowerMessage === "2" || estadoKeywords.some(keyword => normalizedMessage.includes(keyword))) && !req.session.pendingEstadoStep) {
        req.session.pendingEstadoStep = "cedulaEstado";
        return res.json({ 
          message: combineGreeting(
            greetingMessage, 
            asw ? asw : "Para consultar el estado de tu seguro, por favor indícame tu número de cédula."
          ) 
        });
    }
    
    if (req.session.pendingEstadoStep === "cedulaEstado") {
        if (/^\d+$/.test(lowerMessage)) {
          try {
            const [personaRows] = await pool.execute("SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?", [lowerMessage, corredorId]);
            if (personaRows.length === 0) {
              req.session.pendingEstadoStep = null;
              return res.json({ message: combineGreeting(greetingMessage, "No se encontró persona con ese número de documento y corredor asociado.") });
            }
            const persona = personaRows[0];
            req.session.estadoData = { id_persona: persona.id_persona };
            const [polizas] = await pool.execute("SELECT codigo, referencia, fecha_inicio, fecha_fin, estado_vigencia FROM polizas WHERE id_persona = ?", [persona.id_persona]);
            if (polizas.length === 0) {
              req.session.pendingEstadoStep = null;
              return res.json({ message: combineGreeting(greetingMessage, "No se encontraron pólizas asociadas a ese documento.") });
            }
            const lista = polizas.map(p => 
              `Póliza: ${p.codigo} / ${p.referencia || 'sin referencia'} / Inicio de vigencia: ${formatDate(p.fecha_inicio)} / Fin de vigencia: ${formatDate(p.fecha_fin)} / Estado: ${p.estado_vigencia.toLowerCase()}`
            ).join("\n");
            req.session.pendingEstadoStep = "detallePoliza";
            return res.json({ message: combineGreeting(greetingMessage, `Estas son tus pólizas:\n${lista}\n¿Necesitas alguna información específica de alguna póliza? Por favor, indícame de qué póliza necesitas.`) });
          } catch (error) {
            console.error("Error al consultar estado:", error);
            return res.json({ message: combineGreeting(greetingMessage, "Error al procesar la solicitud, por favor inténtalo nuevamente.") });
          }
        } else {
          return res.json({ message: combineGreeting(greetingMessage, "Por favor, ingresa un número de cédula válido.") });
        }
    }
    
    if (req.session.pendingEstadoStep === "detallePoliza") {
        if (userMessage) {
          try {
            const id_persona = req.session.estadoData.id_persona;
            await pool.execute(
              "INSERT INTO tareasdelchat (id_persona, descripcion, estado, numero_poliza) VALUES (?, ?, ?, ?)",
              [id_persona, "Mandar la documentación de la póliza elegida por el cliente", "pendiente", userMessage]
            );
            req.session.pendingEstadoStep = null;
            req.session.estadoData = null;
            return res.json({ message: combineGreeting(greetingMessage, "Tu solicitud se ha registrado, nos comunicaremos contigo a la brevedad.") });
          } catch (error) {
            console.error("Error al registrar la tarea:", error);
            return res.json({ message: combineGreeting(greetingMessage, "Error al registrar la solicitud, por favor inténtalo nuevamente.") });
          }
        } else {
          return res.json({ message: combineGreeting(greetingMessage, "Por favor, indícame la información específica de la póliza que necesitas.") });
        }
    }
    return null;
}

async function cambioFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw=null) {
    const cambioKeywords = [
        "cambio vehiculo",
        "cambio de vehiculo",
        "cambiar auto",
        "modificar auto",
        "cambio cobertura",
        "cambio de cobertura",
        "cambiar cobertura",
        "cambio matricula",
        "cambio de matricula",
        "cambiar matricula",
        "vendi mi auto tengo uno nuevo",
        "quiero cambiar la chapa",
        "cambiar circulacion",
        "cambiar de zona",
        "quiero cambiar de cobertura",
        "cambiar el seguro de la moto",
        "quiero cambiar la patente del auto",
        "tengo patente nueva",
        "cambiar la camioneta",
        "quiero cambiarle el seguro a la camioneta"
    ];
    
    if ((lowerMessage === "3" || cambioKeywords.some(keyword => normalizedMessage.includes(keyword))) && !req.session.pendingChangeStep) {
        req.session.pendingChangeStep = "tipoCambio";
        req.session.changeData = {};
        return res.json({ 
          message: combineGreeting(
            greetingMessage, 
            asw ? asw : "¿Qué cambio deseas hacer?\nA. Vehículo\nB. Cobertura\nC. Matrícula"
          ) 
        });
    }
    
    if (req.session.pendingChangeStep === "tipoCambio") {
        const letra = lowerMessage;
        if (["a", "b", "c"].includes(letra)) {
          req.session.changeData.tipoCambio = letra;
          req.session.pendingChangeStep = "cedulaChange";
          return res.json({ message: combineGreeting(greetingMessage, "Para proceder con el cambio, por favor indícame tu número de documento de identidad.") });
        } else {
          return res.json({ message: combineGreeting(greetingMessage, "Por favor, selecciona una opción válida: A, B o C.") });
        }
    }
    
    if (req.session.pendingChangeStep === "cedulaChange") {
        if (/^\d+$/.test(lowerMessage)) {
          req.session.changeData.cedula = lowerMessage;
          try {
            const [personaRows] = await pool.execute("SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?", [lowerMessage, corredorId]);
            if (personaRows.length === 0) {
              req.session.pendingChangeStep = null;
              return res.json({ message: combineGreeting(greetingMessage, "No se encontró persona con ese número de documento y corredor asociado.") });
            }
            const persona = personaRows[0];
            req.session.changeData.id_persona = persona.id_persona;
            const [polizas] = await pool.execute("SELECT codigo, referencia, fecha_inicio, fecha_fin FROM polizas WHERE id_persona = ?", [persona.id_persona]);
            if (polizas.length === 0) {
              req.session.pendingChangeStep = null;
              return res.json({ message: combineGreeting(greetingMessage, "No se encontraron pólizas asociadas a ese documento.") });
            }
            const lista = polizas.map(p => 
              `Poliza: ${p.codigo} / ${p.referencia || 'sin referencia'} / Inicio: ${formatDate(p.fecha_inicio)} / Fin: ${formatDate(p.fecha_fin)}`
            ).join("\n");
            req.session.pendingChangeStep = "seleccionPolizaChange";
            return res.json({ message: combineGreeting(greetingMessage, `${persona.nombre}, estas son tus pólizas:\n${lista}\nPor favor, indícame el número de la póliza que deseas cambiar.`) });
          } catch (error) {
            console.error("Error al buscar la persona para cambios:", error);
            return res.json({ message: combineGreeting(greetingMessage, "Error al procesar tu documento. Por favor, inténtalo nuevamente.") });
          }
        } else {
          return res.json({ message: combineGreeting(greetingMessage, "Por favor, ingresa un número de documento válido.") });
        }
    }
    
    if (req.session.pendingChangeStep === "seleccionPolizaChange") {
        if (/^\d+$/.test(lowerMessage)) {
          req.session.changeData.numeroPoliza = lowerMessage;
          if (req.session.changeData.tipoCambio === "a") {
            req.session.pendingChangeStep = "fotoVehiculo";
            return res.json({ message: combineGreeting(greetingMessage, "Para cambio de vehículo, por favor envía la foto de la propiedad del nuevo vehículo.") });
          } else if (req.session.changeData.tipoCambio === "b") {
            try {
              await pool.execute(
                "INSERT INTO tareasdelchat (id_persona, descripcion, estado, numero_poliza) VALUES (?, ?, ?, ?)",
                [req.session.changeData.id_persona, "Cambio de cobertura para la póliza.", "pendiente", req.session.changeData.numeroPoliza]
              );
              req.session.pendingChangeStep = null;
              req.session.changeData = null;
              return res.json({ message: combineGreeting(greetingMessage, "Procedemos con el cambio de cobertura y a la brevedad te mandamos la nueva documentación.") });
            } catch (error) {
              console.error("Error al registrar tarea de cambio de cobertura:", error);
              req.session.pendingChangeStep = null;
              req.session.changeData = null;
              return res.json({ message: combineGreeting(greetingMessage, "Error al registrar la solicitud, por favor inténtalo nuevamente.") });
            }
          } else if (req.session.changeData.tipoCambio === "c") {
            req.session.pendingChangeStep = "nuevaMatricula";
            return res.json({ message: combineGreeting(greetingMessage, "Por favor, indícame la nueva matrícula.") });
          } else {
            req.session.pendingChangeStep = null;
            req.session.changeData = null;
            return res.json({ message: combineGreeting(greetingMessage, "Opción no válida para el cambio. Por favor, inténtalo nuevamente.") });
          }
        } else {
          return res.json({ message: combineGreeting(greetingMessage, "Por favor, ingresa un número de póliza válido.") });
        }
    }
    
    if (req.session.pendingChangeStep === "fotoVehiculo") {
        if (userMessage.startsWith("data:")) {
          req.session.changeData.fotoVehiculo = userMessage;
          try {
            await pool.execute(
              "INSERT INTO tareasdelchat (id_persona, descripcion, estado, numero_poliza, imagen) VALUES (?, ?, ?, ?, ?)",
              [req.session.changeData.id_persona, "Cambio de vehículo para la póliza. Foto de la propiedad del nuevo vehículo recibida.", "pendiente", req.session.changeData.numeroPoliza, req.session.changeData.fotoVehiculo]
            );
            req.session.pendingChangeStep = null;
            req.session.changeData = null;
            return res.json({ message: combineGreeting(greetingMessage, "Procedemos con el cambio de vehículo y a la brevedad te mandamos la nueva documentación.") });
          } catch (error) {
            console.error("Error al registrar tarea de cambio de vehículo:", error);
            req.session.pendingChangeStep = null;
            req.session.changeData = null;
            return res.json({ message: combineGreeting(greetingMessage, "Error al registrar la solicitud, por favor inténtalo nuevamente.") });
          }
        } else {
          return res.json({ message: combineGreeting(greetingMessage, "Por favor, envía la foto de la propiedad del nuevo vehículo en formato Base64.") });
        }
    }
    
    if (req.session.pendingChangeStep === "nuevaMatricula") {
        if (lowerMessage) {
          req.session.changeData.nuevaMatricula = lowerMessage;
          try {
            await pool.execute(
              "INSERT INTO tareasdelchat (id_persona, descripcion, estado, numero_poliza) VALUES (?, ?, ?, ?)",
              [req.session.changeData.id_persona, `Cambio de matrícula para la póliza. Nueva matrícula: ${lowerMessage}`, "pendiente", req.session.changeData.numeroPoliza]
            );
            req.session.pendingChangeStep = null;
            req.session.changeData = null;
            return res.json({ message: combineGreeting("Procedemos con el cambio de matrícula y a la brevedad te mandamos la nueva documentación.") });
          } catch (error) {
            console.error("Error al registrar tarea de cambio de matrícula:", error);
            req.session.pendingChangeStep = null;
            req.session.changeData = null;
            return res.json({ message: combineGreeting("Error al registrar la solicitud, por favor inténtalo nuevamente.") });
          }
        } else {
            return res.json({ message: combineGreeting("Por favor, indícame la nueva matrícula.") });
        }
    }
    return null;
}

async function bajaFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw=null) {
    const bajaKeywords = [
        "baja seguro",
        "dar de baja",
        "cancelar seguro",
        "no renovar seguro",
        "cancelacion seguro",
        "no renovar",
        "baja póliza",
        "cancelar póliza",
        "cancelacion póliza",
        "terminar seguro",
        "no quiero mas el seguro",
        "no quiero renovar",
        "dame de baja el seguro",
        "cancelame el seguro del auto",
        "cancelame el seguro de la moto",
        "no quiero mas el seguro de la camioneta",
        "dar de baja el seguro",
        "no me renueves",
        "vendi la moto",
        "no tengo mas el auto",
        "Anular seguro"
      ];
    
    if (lowerMessage === "6" || bajaKeywords.some(keyword => normalizedMessage.includes(keyword))) {
        return res.json({ 
          message: combineGreeting(greetingMessage, 
            asw ? asw : `Para solicitar la baja o no renovación de su seguro, por favor complete la información solicitada en el siguiente enlace: https://forms.gle/gQhXUisRruCCRuEy9
            Le recordamos que deberá adjuntar una foto de su documento de identidad y una carta firmada a mano con el motivo de la baja. Una vez completado el formulario, uno de nuestros agentes se comunicará con usted para confirmar y finalizar el proceso. La baja se hará efectiva solo después de esta llamada.`)
        });
    }
    return null;
}

async function horarioFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw=null) {
  const oficinaKeywords = [
        "horario de oficina",
        "ubicacion de oficina",
        "direccion de oficina",
        "donde quedas",
        "horario de atencion",
        "oficina",
        "sucursal",
        "direccion",
        "ubicacion",
        "donde estas",
        "en salto donde estan",
        "en maldonado donde estan",
        "para ir a imprimir la poliza",
        "para levantar los papeles de la renovación",
        "donde queda ",
        "hoy estan abierto",
        "manana trabajan ",
        "a que hora abren",
        "de tarde estan",
        "donde levanto la poliza",
        "los sabado trabajan"
    ];
    if (lowerMessage === "7" || oficinaKeywords.some(keyword => normalizedMessage.includes(keyword))) {
        try {
          const [corredorRows] = await pool.execute("SELECT direccion, direccion_2, horario_oficina FROM corredores WHERE id_corredor = ?", [corredorId]);
          if (corredorRows.length > 0) {
            const corredor = corredorRows[0];
            const oficinaMessage = asw ? asw : `Horario y Ubicación:\nDirección: ${corredor.direccion}\n${corredor.direccion_2 ? "Dirección 2: " + corredor.direccion_2 + "\n" : ""}Horario de oficina: ${corredor.horario_oficina}\n\nRecuerda que el 90% de las solicitudes las podemos hacer por este medio; no necesitás ir a la oficina. Decime, capaz puedo ayudarte por acá.`;
            return res.json({ message: combineGreeting(greetingMessage, oficinaMessage) });
          } else {
            return res.json({ message: combineGreeting(greetingMessage, "No se encontró información de tu asesor.") });
          }
        } catch (error) {
          console.error("Error al obtener la información del corredor:", error);
          return res.json({ message: combineGreeting(greetingMessage, "Error al obtener la información, por favor inténtalo nuevamente.") });
        }
    }
    return null;
}

async function revisaFlujos(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw=null) {
    // ------------------------------
  // Bloque: Solicitud de asistencia (grúa, choque, etc.)
  // ------------------------------
  const asistenciaFlujoResponse = await asistenciaFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, asw);
  if (asistenciaFlujoResponse !== null) {
    return asistenciaFlujoResponse;
  }

  // --------------------------------------------------
  // Opción 1: Cotizar un nuevo seguro (Flujo conversacional)
  // --------------------------------------------------
  const cotizacionFlujoResponse = await cotizacionFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw);
  if (cotizacionFlujoResponse !== null) {
    return cotizacionFlujoResponse;
  }

  // --------------------------------------------------
  // Opción 2: Estado de mi seguro
  // --------------------------------------------------
  const estadoFlujoResponse = await estadoFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw);
  if (estadoFlujoResponse !== null) {
    return estadoFlujoResponse;
  }

  // --------------------------------------------------
  // Opción 3: Cambio de Vehículo, Cambio de cobertura o cambio de matrícula
  // --------------------------------------------------
  const cambioFlujoResponse = await cambioFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw);
  if (cambioFlujoResponse !== null) {
    return cambioFlujoResponse;
  }

  // --------------------------------------------------
  // Opción 6: Dar de baja una póliza
  // --------------------------------------------------
  const bajaFlujoResponse = await bajaFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw);
  if (bajaFlujoResponse !== null) {
    return bajaFlujoResponse;
  }

  // --------------------------------------------------
  // Opción 7: Horario de oficina y ubicación
  // --------------------------------------------------
  const horarioFlujoResponse = await horarioFlujo(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage, asw);
  if (horarioFlujoResponse !== null) {
    return horarioFlujoResponse;
  }

  if (lowerMessage === '8' && asw != null) {
    return res.json({ message: combineGreeting(greetingMessage, asw) });
  }

  return null;
}

async function getRAGandGPT(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage) {
    const [ragRows] = await pool.execute("SELECT rag FROM rag WHERE id_corredor = ?", [corredorId]);
    if (ragRows.length > 0) {
        const comportamientoRAG = ragRows[0].rag;
        const respuestaGPT = await obtenerRespuestaDeGPT(
            comportamientoRAG, 
            `No entendí tu mensaje: ${userMessage}. Por favor, selecciona una de las opciones disponibles.`
        );
        return res.json({ message: combineGreeting(greetingMessage, respuestaGPT) });
    } else {
        const respuestaGPT = await obtenerRespuestaDeGPT(
            "No se encontró el comportamiento en la base de datos, por favor intenta más tarde.", 
            `No entendí tu mensaje: ${userMessage}. Por favor, selecciona una de las opciones disponibles.`
        );
        return res.json({ message: combineGreeting(greetingMessage, respuestaGPT) });
    }
}

// Exportar las funciones para que puedan ser importadas en otros archivos
module.exports = { 
    obtenerRespuestaDeGPT, 
    buscarEnChroma,
    botWelcomeUser,
    detectarSaludo,

    revisaFlujos,
    getRAGandGPT,
};