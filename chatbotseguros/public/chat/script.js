// Elementos del DOM
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const fileInput = document.getElementById('file-input');
const sendBtn = document.getElementById('send-btn');

// Define el identificador del corredor (este valor se cambiará para cada front-end)
const corredorId = parseInt(window.location.pathname.split('/').pop());

// Función para agregar mensajes al chat
function addMessage(content, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  const messageContent = document.createElement('p');
  messageContent.innerText = content;
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para leer un archivo como Base64
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Función para enviar mensaje al servidor
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  
  addMessage(message, 'user');

  // Verificar si se ha seleccionado un archivo
  let fileData = null;
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    // Permitir solo JPG, PNG o PDF
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert("Por favor, adjunta solo archivos JPG, PNG o PDF.");
      return;
    }
    try {
      fileData = await readFileAsBase64(file);
    } catch (error) {
      console.error("Error al leer el archivo:", error);
      alert("Hubo un error al leer el archivo. Inténtalo nuevamente.");
      return;
    }
  }
  
  // Limpiar los campos
  userInput.value = "";
  fileInput.value = "";

  const payload = { 
    message: message, 
    corredorId: corredorId,
  };
  if (fileData) {
    payload.fotoPropiedad = fileData;
  }

  console.log("Enviando payload:", payload);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    addMessage(data.message, 'bot');
  } catch (error) {
    addMessage("Error al enviar el mensaje. Intenta nuevamente.", 'bot');
  }
}

// Eventos: click en el botón o presionar Enter en el campo de texto
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendMessage();
});