// Función auxiliar para formatear fechas (YYYY-MM-DD)
const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
};

// Función para combinar el saludo (si existe) con cualquier respuesta
function combineGreeting(greetingMessage, originalResponse) {
    if (!greetingMessage) {
      return originalResponse;
    }
    return greetingMessage + " " + originalResponse;
}

function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


module.exports = {
    formatDate,
    combineGreeting,
    normalizeText,
}