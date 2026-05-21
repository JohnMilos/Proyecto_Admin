// Para Twilio (servicio real de SMS)
const twilio = require('twilio');

// Servicio de SMS simulado para desarrollo
const simulatedSMSService = {
    send: async (to, message) => {
        console.log(`[SMS SIMULADO] Enviado a: ${to}`);
        console.log(`[SMS SIMULADO] Mensaje: ${message}`);
        console.log('---');
        return { success: true, simulated: true };
    }
};

// Servicio de SMS real con Twilio
const realSMSService = {
    send: async (to, message) => {
        try {
            const client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            // Formatear número a formato internacional (México)
            const formattedTo = to.startsWith('+') ? to : `+52${to.replace(/\D/g, '')}`;

            const result = await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: formattedTo
            });

            console.log(`SMS enviado a ${formattedTo}: ${result.sid}`);
            return { success: true, sid: result.sid };
        } catch (error) {
            console.error('Error enviando SMS real:', error);
            return { success: false, error: error.message };
        }
    }
};

// Elegir el servicio basado en la configuración
const getSMSService = () => {
    const hasTwilioConfig = process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER;

    return hasTwilioConfig ? realSMSService : simulatedSMSService;
};

const smsService = getSMSService();

const sendSMS = async (to, message) => {
    return await smsService.send(to, message);
};

// Plantillas de SMS
const smsTemplates = {
    appointmentConfirmation: (appointment, patient, dentist) => {
        const date = new Date(appointment.appointmentDate);
        const formattedDate = date.toLocaleDateString('es-MX');
        const formattedTime = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `Odontología Integral: Cita confirmada. Folio: ${appointment.folio}. Fecha: ${formattedDate} a las ${formattedTime}. Dentista: ${dentist.name}. Puede reagendar hasta 48h antes o cancelar hasta 24h antes.`;
    },

    appointmentCancellation: (appointment, patient, dentist) => {
        return `Odontología Integral: Su cita ${appointment.folio} ha sido cancelada. Para agendar nueva cita visite nuestro sistema.`;
    },

    appointmentReschedule: (appointment, patient, dentist) => {
        const date = new Date(appointment.appointmentDate);
        const formattedDate = date.toLocaleDateString('es-MX');
        const formattedTime = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        return `Odontología Integral: Cita reagendada. Nuevo horario: ${formattedDate} a las ${formattedTime}. Folio: ${appointment.folio}. Dentista: ${dentist.name}.`;
    },

    dentistNotification: (appointment, patient, dentist, type) => {
        const date = new Date(appointment.appointmentDate);
        const formattedDate = date.toLocaleDateString('es-MX');
        const formattedTime = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const action = type === 'confirmation' ? 'agendada' :
            type === 'cancellation' ? 'cancelada' : 'reagendada';

        return `Odontología Integral: Cita ${action} con ${patient.name} (${patient.phone}) para el ${formattedDate} a las ${formattedTime}. Folio: ${appointment.folio}.`;
    }
};

module.exports = { sendSMS, smsTemplates };