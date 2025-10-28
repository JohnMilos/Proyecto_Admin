const Penalizacion = require('../models/Penalty.js');

// Crear penalización
const crearPenalizacion = async (req, res) => {
    try {
        const { pacienteId, motivo, porcentaje } = req.body;

        const penalizacion = await Penalizacion.create({
            pacienteId,
            motivo,
            porcentaje,
        });

        res.status(201).json({ mensaje: 'Penalización creada exitosamente', penalizacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Obtener penalizaciones de un paciente
const obtenerPenalizaciones = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const penalizaciones = await Penalizacion.findAll({ where: { pacienteId } });
        res.json(penalizaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Actualizar penalización
const actualizarPenalizacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo, porcentaje } = req.body;

        const penalizacion = await Penalizacion.findByPk(id);
        if (!penalizacion) {
            return res.status(404).json({ mensaje: 'Penalización no encontrada' });
        }

        await penalizacion.update({
            motivo: motivo || penalizacion.motivo,
            porcentaje: porcentaje || penalizacion.porcentaje,
        });

        res.json({ mensaje: 'Penalización actualizada exitosamente', penalizacion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Eliminar penalización
const eliminarPenalizacion = async (req, res) => {
    try {
        const { id } = req.params;

        const penalizacion = await Penalizacion.findByPk(id);
        if (!penalizacion) {
            return res.status(404).json({ mensaje: 'Penalización no encontrada' });
        }

        await penalizacion.destroy();
        res.json({ mensaje: 'Penalización eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { crearPenalizacion, obtenerPenalizaciones, actualizarPenalizacion, eliminarPenalizacion };