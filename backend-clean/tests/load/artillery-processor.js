// Generador de números aleatorios para Artillery
function randomNumber() {
    return Math.floor(Math.random() * 100000);
}

// Función para generar email único
function generateEmail(userContext, events, done) {
    const random = Math.floor(Math.random() * 100000);
    userContext.vars.email = `test${random}@example.com`;
    userContext.vars.phone = `555${random}`;
    return done();
}

// Función para generar fecha futura (cita)
function generateFutureDate() {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
    date.setHours(10 + Math.floor(Math.random() * 8));
    return date.toISOString();
}

// Exportar funciones para usar en el YAML
module.exports = {
    randomNumber,
    generateEmail,
    generateFutureDate
};