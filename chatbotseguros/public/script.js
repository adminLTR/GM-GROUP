document.getElementById('send').addEventListener('click', async () => {
    const message = document.getElementById('message').value;

    if (!message) {
        alert("Por favor, escribe un mensaje.");
        return;
    }

    // Agregar mensaje del usuario al chat
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.textContent = message;
    document.getElementById('chat').appendChild(userMessage);

    document.getElementById('message').value = ''; // Limpiar input

    try {
        // Enviar mensaje al servidor
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Verificar si el servidor devolvió un mensaje
        if (data.message) {
            // Agregar respuesta del bot al chat
            const botMessage = document.createElement('div');
            botMessage.className = 'bot-message';
            botMessage.textContent = data.message; // Usar la propiedad 'message' del objeto
            document.getElementById('chat').appendChild(botMessage);
        } else {
            // Manejar respuesta inesperada
            const errorMessage = document.createElement('div');
            errorMessage.className = 'bot-message';
            errorMessage.textContent = "⚠️ Respuesta del servidor no válida.";
            document.getElementById('chat').appendChild(errorMessage);
        }
    } catch (error) {
        // Manejar errores
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bot-message';
        errorMessage.textContent = "⚠️ Error al conectar con el servidor.";
        document.getElementById('chat').appendChild(errorMessage);
    }

    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight; // Auto-scroll
});