const Cita = require('../models/Cita');
const Usuario = require('../models/User.js');
const EspacioDisponible = require('../models/EspacioDisponible');
const Penalizacion = require('../models/Penalty.js');
const { Op } = require('sequelize');

// agendar la cita
const agendarCita = async (req, res) => {
    try {
        const { profesionalId, espacioDisponibleId } = req.body;
        const pacienteId = req.usuario.id;

        // verificar que el paciente no tenga una penalización activa
        const penalizacionActiva = await Penalizacion.findOne({
            where: { pacienteId, estado: 'activa' },
        });
        if (penalizacionActiva) {
            return res.status(400).json({ mensaje: 'Tiene una penalización activa. Deberá pagar un cargo del 20% al finalizar la cita.' });
        }

        // obtener el espacio disponible
        const espacio = await EspacioDisponible.findByPk(espacioDisponibleId);
        if (!espacio || espacio.estado !== 'disponible') {
            return res.status(400).json({ mensaje: 'El espacio seleccionado no está disponible' });
        }

        // se crea la cita
        const cita = await Cita.create({
            folio: generarFolio(), // Función para generar folio único
            fechaHora: new Date(`${espacio.fecha} ${espacio.horaInicio}`),
            pacienteId,
            profesionalId,
        });

        // Marcar el espacio como ocupado
        await espacio.update({ estado: 'ocupado' });

        // enviar notificacion (que aiun no se omplemneta

        res.status(201).json({ mensaje: 'Cita agendada exitosamente', cita });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// se obtienen las citas ya sea cliente o admin
const obtenerCitas = async (req, res) => {
    try {
        let citas;
        if (req.usuario.rol === 'paciente') {
            citas = await Cita.findAll({
                where: { pacienteId: req.usuario.id },
                include: [{ model: Usuario, as: 'profesional', attributes: ['id', 'nombre', 'especialidad'] }],
            });
        } else if (req.usuario.rol === 'profesional') {
            citas = await Cita.findAll({
                where: { profesionalId: req.usuario.id },
                include: [{ model: Usuario, as: 'paciente', attributes: ['id', 'nombre', 'telefono'] }],
            });
        } else if (req.usuario.rol === 'administrador') {
            citas = await Cita.findAll({
                include: [
                    { model: Usuario, as: 'paciente', attributes: ['id', 'nombre', 'telefono'] },
                    { model: Usuario, as: 'profesional', attributes: ['id', 'nombre', 'especialidad'] },
                ],
            });
        }
        res.json(citas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// el paciente canccela la cita
const cancelarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        // verificar que la cita pertenece al paciente
        if (req.usuario.rol === 'paciente' && cita.pacienteId !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tiene permiso para cancelar esta cita' });
        }

        // verificar que se cancele dentro de las 24 horas previas
        const ahora = new Date();
        const diferencia = cita.fechaHora - ahora;
        const horasDiferencia = diferencia / (1000 * 60 * 60);
        if (horasDiferencia < 24) {
            return res.status(400).json({ mensaje: 'Solo se puede cancelar con al menos 24 horas de anticipación' });
        }

        // cambiar estado de la cita
        await cita.update({ estado: 'cancelada' });

        // liberar el espacio disponible
        const espacio = await EspacioDisponible.findOne({
            where: {
                profesionalId: cita.profesionalId,
                fecha: cita.fechaHora.toISOString().split('T')[0],
                horaInicio: cita.fechaHora.toTimeString().split(' ')[0],
            },
        });
        if (espacio) {
            await espacio.update({ estado: 'disponible' });
        }

        // enviar notificacion (no se implementa aun(

        res.json({ mensaje: 'Cita cancelada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// el paciente reagenda la cita
const reagendarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoEspacioDisponibleId } = req.body;
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        // vrificar que la cita pertenece al paciente
        if (req.usuario.rol === 'paciente' && cita.pacienteId !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tiene permiso para reagendar esta cita' });
        }

        // verificar que se reagende dentro de las 48 horas previas
        const ahora = new Date();
        const diferencia = cita.fechaHora - ahora;
        const horasDiferencia = diferencia / (1000 * 60 * 60);
        if (horasDiferencia < 48) {
            return res.status(400).json({ mensaje: 'Solo se puede reagendar con al menos 48 horas de anticipación' });
        }

        // obtener el nuevo espacio disponible
        const nuevoEspacio = await EspacioDisponible.findByPk(nuevoEspacioDisponibleId);
        if (!nuevoEspacio || nuevoEspacio.estado !== 'disponible') {
            return res.status(400).json({ mensaje: 'El nuevo espacio seleccionado no está disponible' });
        }

        // libera el espacio anterior
        const espacioAnterior = await EspacioDisponible.findOne({
            where: {
                profesionalId: cita.profesionalId,
                fecha: cita.fechaHora.toISOString().split('T')[0],
                horaInicio: cita.fechaHora.toTimeString().split(' ')[0],
            },
        });
        if (espacioAnterior) {
            await espacioAnterior.update({ estado: 'disponible' });
        }

        // actualiza la cita con fecha y hora
        await cita.update({
            fechaHora: new Date(`${nuevoEspacio.fecha} ${nuevoEspacio.horaInicio}`),
        });

        // Marcar el nuevo espacio como ocupado
        await nuevoEspacio.update({ estado: 'ocupado' });

        // enviar notificacion que aun no se implementa xd

        res.json({ mensaje: 'Cita reagendada exitosamente', cita });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// el dentirta acepta la cita
const aceptarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        // verifica que la cita pertenece al dentista
        if (cita.profesionalId !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tiene permiso para aceptar esta cita' });
        }

        await cita.update({ estado: 'confirmada' });

        // aun no lo implemento, es para enviar el mensaje al cliente de que ya se genero ala cita

        res.json({ mensaje: 'Cita aceptada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// aqui puede terminar la cita el dentista
const terminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const cita = await Cita.findByPk(id);
        if (!cita) {
            return res.status(404).json({ mensaje: 'Cita no encontrada' });
        }

        // aqui verifica que la cita pertenece al dentista
        if (cita.profesionalId !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No tiene permiso para terminar esta cita' });
        }

        await cita.update({ estado: 'terminada' });

        res.json({ mensaje: 'Cita terminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// función para generar folio único (se reciclan folios despues de un tiempo?)
function generarFolio() {
    return `CITA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = { agendarCita, obtenerCitas, cancelarCita, reagendarCita, aceptarCita, terminarCita };