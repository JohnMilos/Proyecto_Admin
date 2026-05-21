function generateFolio() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CITA-${timestamp}-${random}`;
}

module.exports = generateFolio;