require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const pool = require('./db'); // Conexión a la base de datos
const session = require('express-session');
const bcrypt = require('bcrypt'); // <-- Importar bcrypt
const path = require('path');

const {
  formatDate,
  combineGreeting,
  normalizeText
} = require("./js/utils")

const { 
  buscarEnChroma,
  botWelcomeUser,
  detectarSaludo,

  revisaFlujos,
  getRAGandGPT
} = require('./js/bot-functions');

const app = express();
const PORT = process.env.PORT;

// Configuración de sesiones
app.use(session({
  secret: 'Ma260512!!', // Tu clave segura
  resave: false,
  saveUninitialized: true,
}));

// Middleware: Aumentamos el límite para soportar archivos grandes (por ejemplo, Base64)
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(express.static('public'));

// Clave de API de OpenAI
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// URL base de la API de San Cristóbal (UAT)
const BASE_URL = process.env.BASE_URL;

// Función para obtener el token (credenciales en el .env)
async function getToken() {
  try {
    const response = await axios.post(`${BASE_URL}/api/Login`, {
      Usuario: process.env.SAN_CRISTOBAL_USER,
      Password: process.env.SAN_CRISTOBAL_PASS,
    });
    return response.data.Token;
  } catch (error) {
    console.error('Error al obtener token:', error.message);
    throw new Error('No se pudo obtener el token');
  }
}

// Función para obtener cotización (no se usa en el flujo actual)
async function obtenerCotizacionAuto(datosCotizacion) {
  try {
    const token = await getToken();
    const response = await axios.post(`${BASE_URL}/api/quote/auto`, datosCotizacion, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener cotización:', error.message);
    throw new Error('No se pudo obtener la cotización');
  }
}

app.get('/chat/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat', 'index.html'));
});

app.get('/api/list-corredores', async (req, res) => {

  try {
    const [rows] = await pool.execute("SELECT * FROM corredores");
    if (rows.length > 0) {
      return res.json({ corredores: rows });
    } else {
      return res.json({ message: "No hay corredores registrados." });
    }
  } catch (error) {
    console.error("Error al obtener los corredores", error);
    return res.status(500).json({ message: "Error al obtener los corredores" });
  }
});

// ==================================================
//   RUTA DE LOGIN (con verificación bcrypt)
// ==================================================
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;  // Lo que te envía el front: { username, password }

    // Validar que vengan credenciales
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Faltan credenciales.' });
    }

    // 1. Buscar al usuario por su username
    const [rows] = await pool.execute(
      "SELECT * FROM usuarios WHERE username = ? LIMIT 1",
      [username]
    );

    // Si no existe el usuario
    if (rows.length === 0) {
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    // Recuperar la fila del usuario
    const user = rows[0];
    // Suponiendo que tu columna de la contraseña se llama 'password' y almacena el hash
    const hashedPassword = user.password;

    // 2. Comparamos la contraseña en texto plano con la almacenada (encriptada)
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      // Contraseña inválida
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    // 3. Si es correcta, podríamos guardar datos en la sesión:
    req.session.userId = user.id_usuario; // O el campo que uses como ID
    req.session.username = user.username; // Guardas lo que necesites

    // 4. Respuesta de éxito
    return res.json({ success: true, message: 'Login exitoso' });

  } catch (error) {
    console.error('Error en /api/login:', error);
    return res.status(500).json({ success: false, message: 'Error al iniciar sesión.' });
  }
});

// ==================================================
// RUTA PARA VALIDAR CÉDULA SEGÚN CONTEXTO
// ==================================================
app.post('/api/query', async (req, res) => {
  const { cedula, contexto, corredorId } = req.body;
  
  if (!/^\d+$/.test(cedula)) {
    return res.json({ message: "Por favor, ingresa un número de cédula válido, sin puntos ni guiones." });
  }
  
  if (contexto === "asistencia") {
    console.log("Flujo de asistencia activado para cédula:", cedula);
    try {
      const [personaRows] = await pool.execute(
        "SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?",
        [cedula, corredorId]
      );
      if (personaRows.length === 0) {
        return res.json({ message: "No se encontró persona con ese número de documento y corredor asociado." });
      }
      const persona = personaRows[0];
      const [polizas] = await pool.execute(
        "SELECT * FROM polizas WHERE id_persona = ? AND estado_vigencia = 'vigente'",
        [persona.id_persona]
      );
      if (polizas.length === 0) {
        return res.json({ message: "No se encontró ninguna póliza activa asociada a ese documento." });
      } else if (polizas.length === 1) {
        const poliza = polizas[0];
        const [companiaRows] = await pool.execute(
          "SELECT * FROM companias_seguros WHERE id_compania = ?",
          [poliza.id_compania]
        );
        if (companiaRows.length === 0) {
          return res.json({ message: "No se encontró información de la compañía para esa póliza." });
        }
        const compania = companiaRows[0];
        return res.json({
          message: `Mira, tenés que llamar a la compañía que tenés el seguro contratado, la misma es ${compania.nombre} y su Teléfono es ${compania.telefono}.`
        });
      } else {
        const lista = polizas
          .map(p => `Póliza: ${p.codigo} / ${p.referencia || 'sin referencia'} / Inicio: ${formatDate(p.fecha_inicio)} / Fin: ${formatDate(p.fecha_fin)}`)
          .join("\n");
        return res.json({ message: `Estas son tus pólizas activas:\n${lista}\nPor favor, indícame en cuál póliza deseas cambiar algo.` });
      }
    } catch (error) {
      console.error("Error en la consulta de asistencia:", error);
      return res.json({ message: "Error al procesar la solicitud, por favor inténtalo nuevamente." });
    }
  } else {
    try {
      const [personaRows] = await pool.execute(
        "SELECT * FROM persona WHERE cedula = ? AND id_corredor = ?",
        [cedula, corredorId]
      );
      if (personaRows.length > 0) {
        const persona = personaRows[0];
        return res.json({ message: `Perfecto, al brevedad ${persona.nombre} se comunicará contigo para ayudarte con esto.` });
      } else {
        return res.json({ message: "No se encontró persona con ese número de documento y corredor asociado." });
      }
    } catch (error) {
      console.error("Error al buscar la persona:", error);
      return res.json({ message: "Error al procesar la solicitud, por favor inténtalo nuevamente." });
    }
  }
});

// ==================================================
// RUTA PRINCIPAL DEL CHATBOT
// ==================================================
app.post('/api/chat', async (req, res) => {
  // Mensaje original y corredor
  let userMessage = req.body?.message?.trim() || "";
  const corredorId = req.body?.corredorId; // Debe enviarse desde el front-end

  if (!corredorId || isNaN(corredorId)) {
    return res.json({ message: "El identificador del corredor no se proporcionó o no es válido." });
  }
  // Mensaje de bienvenida (se envía la primera vez)
  if (!req.session.welcomeSent) {
    return await botWelcomeUser(req, res, pool, corredorId);
  }

  // ==================================================
  // 1) DETECTAR SALUDO y guardarlo en greetingMessage
  // ==================================================
  const {lowerMessage, greetingMessage, userMsg} = detectarSaludo(userMessage);
  userMessage = userMsg;
  const normalizedMessage = normalizeText(lowerMessage);
  
  const revisaFlujosResponse = await revisaFlujos(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage);
  if (revisaFlujosResponse !== null) {
    return revisaFlujosResponse;
  }

  // --------------------------------------------------
  // Opción 8: Otras consultas
  // --------------------------------------------------
  if (lowerMessage === "8") {
    // try {
    //   const [ragRows] = await pool.execute("SELECT rag FROM rag WHERE id_corredor = ?", [corredorId]);
    //   if (ragRows.length > 0) {
    //     const comportamientoRAG = ragRows[0].rag;
    //     const respuestaGPT = await obtenerRespuestaDeGPT(comportamientoRAG, "¿En qué puedo ayudarte?");
    //     return res.json({ message: combineGreeting(respuestaGPT) });
    //   } else {
    //     const respuestaGPT = await obtenerRespuestaDeGPT("No se encontró el comportamiento en la base de datos, por favor intenta más tarde.", "¿En qué puedo ayudarte?");
    //     return res.json({ message: combineGreeting(respuestaGPT) });
    //   }
    // } catch (error) {
    //   console.error('Error al consultar el comportamiento del RAG:', error);
    //   return res.json({ message: combineGreeting("Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.") });
    // }
    return res.json({ message: combineGreeting(greetingMessage, "¿En qué puedo ayudarte?") });
  }

  // --------------------------------------------------
  // Respuesta por defecto (consultando el RAG + GPT)
  // --------------------------------------------------
  try {
    const respuestaChroma = await buscarEnChroma(userMessage, corredorId);
    if (respuestaChroma.results.length > 0) {
      const asw = respuestaChroma.results[0].metadata.answer !== '' ? respuestaChroma.results[0].metadata.answer : null
      console.log(respuestaChroma.results[0].metadata.answer)
      const revisaFlujosResponse = await revisaFlujos(req, res, pool, corredorId, normalizeText(respuestaChroma.results[0].document), greetingMessage+"chroma_"+respuestaChroma.db, respuestaChroma.results[0].metadata.value, userMessage, asw);
      if (revisaFlujosResponse !== null) {
        return revisaFlujosResponse;
      }
      return await getRAGandGPT(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage)
    } else {
      return await getRAGandGPT(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage)
    }
  } catch (error) {
    return await getRAGandGPT(req, res, pool, corredorId, normalizedMessage, greetingMessage, lowerMessage, userMessage)
    // return res.json({ message: combineGreeting("Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.") });
  }
});

// --------------------------------------------------
// RUTA PARA GUARDAR EL RAG DE UN CORREDOR
// --------------------------------------------------
app.post('/api/update-rag', async (req, res) => {
  const { corredorId, rag } = req.body;

  if (!corredorId || !rag) {
    return res.status(400).json({ message: "Faltan parámetros requeridos" });
  }

  try {
    const [corredorRows] = await pool.execute(
      "SELECT id_corredor FROM corredores WHERE id_corredor = ?",
      [corredorId]
    );

    if (corredorRows.length === 0) {
      return res.status(404).json({ message: "Corredor no encontrado." });
    }

    await pool.execute(
      "REPLACE INTO rag (id_corredor, rag) VALUES (?, ?)",
      [corredorId, rag]
    );

    res.json({ message: 'RAG guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el RAG:', error);
    res.status(500).json({ message: 'Error al guardar el RAG' });
  }
});

// --------------------------------------------------
// RUTA PARA OBTENER EL RAG DE UN CORREDOR
// --------------------------------------------------
app.get('/api/get-rag', async (req, res) => {
  const corredorId = req.query.corredorId;

  if (!corredorId) {
    return res.status(400).json({ message: "El ID del corredor es requerido." });
  }

  try {
    const [rows] = await pool.execute("SELECT rag FROM rag WHERE id_corredor = ?", [corredorId]);
    if (rows.length > 0) {
      return res.json({ rag: rows[0].rag });
    } else {
      return res.json({ message: "No se encontró RAG para este corredor." });
    }
  } catch (error) {
    console.error("Error al obtener el RAG:", error);
    return res.status(500).json({ message: "Error al obtener el RAG." });
  }
});

// ==================================================
// PRUEBA DE CONEXIÓN CON BASE DE DATOS
// ==================================================
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT 1');
    res.json({ mensaje: 'Conexión exitosa a la base de datos', resultado: rows });
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    res.status(500).json({ mensaje: 'Error al conectar con la base de datos' });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocurrió un error interno en el servidor.' });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


