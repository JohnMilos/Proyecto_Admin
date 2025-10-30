/*const nodemailer = require('nodemailer');

// Configurar el transporter para Gmail
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Usar App Password, no contraseña normal
        }
    });
};

const sendEmail = async (to, subject, html) => {
    // Si no hay configuración de email, simular envío
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[SIMULACIÓN] Email enviado a: ${to}`);
        console.log(`[SIMULACIÓN] Asunto: ${subject}`);
        return { success: true, simulated: true };
    }

    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Odontología Integral" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Email enviado a ${to}: ${result.messageId}`);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error enviando email:', error);
        return { success: false, error: error.message };
    }
};

// Plantillas de email
const emailTemplates = {
    appointmentConfirmation: (appointment, patient, dentist) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const formattedDate = appointmentDate.toLocaleString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; background: #2E86AB; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Odontología Integral</h1>
          <p style="margin: 5px 0 0 0;">Confirmación de Cita</p>
        </div>
        
        <div style="padding: 20px;">
          <p>Estimado/a <strong>${patient.name}</strong>,</p>
          <p>Su cita ha sido confirmada exitosamente.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2E86AB; margin-top: 0;">Detalles de su cita:</h3>
            <p><strong>Folio:</strong> ${appointment.folio}</p>
            <p><strong>Fecha y Hora:</strong> ${formattedDate}</p>
            <p><strong>Dentista:</strong> ${dentist.name}</p>
            <p><strong>Especialidad:</strong> ${dentist.specialty || 'General'}</p>
          </div>

          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107;">
            <h4 style="margin-top: 0; color: #856404;">Políticas de Cancelación</h4>
            <p><strong>Reagendar:</strong> Hasta 48 horas antes sin costo</p>
            <p><strong>Cancelar:</strong> Hasta 24 horas antes sin costo</p>
            <p><strong>Penalización:</strong> 20% por cancelación tardía o inasistencia</p>
          </div>

          <p>Si necesita modificar su cita, ingrese a nuestro sistema o contáctenos.</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Odontología Integral<br>
            Teléfono: [TU_TELEFONO]<br>
            Email: [TU_EMAIL]
          </p>
        </div>
      </div>
    `;
    },

    appointmentCancellation: (appointment, patient, dentist) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const formattedDate = appointmentDate.toLocaleString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; background: #dc3545; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Odontología Integral</h1>
          <p style="margin: 5px 0 0 0;">Cancelación de Cita</p>
        </div>
        
        <div style="padding: 20px;">
          <p>Estimado/a <strong>${patient.name}</strong>,</p>
          <p>Su cita ha sido <strong>cancelada</strong> exitosamente.</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2E86AB; margin-top: 0;">Detalles de la cita cancelada:</h3>
            <p><strong>Folio:</strong> ${appointment.folio}</p>
            <p><strong>Fecha y Hora:</strong> ${formattedDate}</p>
            <p><strong>Dentista:</strong> ${dentist.name}</p>
          </div>

          <p>Para agendar una nueva cita, ingrese a nuestro sistema.</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; margin-top: 20px;">
          <p style="color: #6c757d; font-size: 14px; margin: 0;">
            Odontología Integral<br>
            Teléfono: [TU_TELEFONO]<br>
            Email: [TU_EMAIL]
          </p>
        </div>
      </div>
    `;
    },

    dentistNotification: (appointment, patient, dentist, type) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        const formattedDate = appointmentDate.toLocaleString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const action = type === 'confirmation' ? 'agendada' :
            type === 'cancellation' ? 'cancelada' : 'reagendada';

        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2E86AB;">Notificación de Cita - Odontología Integral</h2>
        <p>Dr./Dra. <strong>${dentist.name}</strong>,</p>
        <p>Se le informa que tiene una cita ${action}.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #2E86AB; margin-top: 0;">Detalles de la cita:</h3>
          <p><strong>Paciente:</strong> ${patient.name}</p>
          <p><strong>Teléfono:</strong> ${patient.phone}</p>
          <p><strong>Email:</strong> ${patient.email}</p>
          <p><strong>Fecha y Hora:</strong> ${formattedDate}</p>
          <p><strong>Folio:</strong> ${appointment.folio}</p>
          <p><strong>Tipo:</strong> ${appointment.type}</p>
        </div>

        <p>Por favor revise su calendario en el sistema.</p>
      </div>
    `;
    }
};
*/
module.exports = { sendEmail, emailTemplates };