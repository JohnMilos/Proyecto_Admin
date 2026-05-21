// const { sendEmail, emailTemplates } = require('./emailService');
// const { sendSMS, smsTemplates } = require('./smsService');

const sendAppointmentNotification = async (appointment, patient, dentist, type) => {
    const results = {
        patientEmail: { success: false },
        patientSMS: { success: false },
        dentistEmail: { success: false },
        dentistSMS: { success: false }
    };

    try {
        console.log(`[SIMULADO] Enviando notificaciones para cita ${appointment.id}, tipo: ${type}`);
        console.log(`[SIMULADO] Paciente: ${patient.email}, Dentista: ${dentist.email}`);

        // NOTIFICACIONES AL PACIENTE - SIMULADAS
        if (patient.email) {
            console.log(`[SIMULADO] Email enviado a paciente: ${patient.email}`);
            results.patientEmail = { success: true, simulated: true };
        }

        // SMS AL PACIENTE - SIMULADO
        if (patient.phone) {
            console.log(`📱 [SIMULADO] SMS enviado a paciente: ${patient.phone}`);
            results.patientSMS = { success: true, simulated: true };
        }

        // NOTIFICACIONES AL DENTISTA - SIMULADAS
        if (dentist.email) {
            console.log(`📧 [SIMULADO] Email enviado a dentista: ${dentist.email}`);
            results.dentistEmail = { success: true, simulated: true };
        }

        // SMS AL DENTISTA - SIMULADO
        if (dentist.phone) {
            console.log(`[SIMULADO] SMS enviado a dentista: ${dentist.phone}`);
            results.dentistSMS = { success: true, simulated: true };
        }

        console.log('[SIMULADO] Notificaciones procesadas correctamente');
        return results;

    } catch (error) {
        console.error('Error en servicio de notificaciones:', error);
        return results;
    }
};

const sendVerificationCode = async (phone, code) => {
    try {
        console.log(`[SIMULADO] Código de verificación ${code} enviado a: ${phone}`);
        return { success: true, simulated: true, code: code };
    } catch (error) {
        console.error('Error enviando código de verificación:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendAppointmentNotification,
    sendVerificationCode
};