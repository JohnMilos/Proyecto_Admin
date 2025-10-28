const Expediente = require('../models/Expediente');

// Crear expediente
const crearExpediente = async (req, res) => {
    try {
        const { pacienteId, observaciones } = req.body;

        // Verificar si ya existe un expediente para el paciente
        const expedienteExistente = await Expediente.findOne({ where: { pacienteId } });
        if (expedienteExistente) {
            return res.status(400).json({ mensaje: 'Ya existe un expediente para este paciente' });
        }

        const expediente = await Expediente.create({
            pacienteId,
            observaciones,
        });

        res.status(201).json({ mensaje: 'Expediente creado exitosamente', expediente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Obtener expediente de un paciente
const obtenerExpediente = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const expediente = await Expediente.findOne({ where: { pacienteId } });
        if (!expediente) {
            return res.status(404).json({ mensaje: 'Expediente no encontrado' });
        }
        res.json(expediente);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Actualizar expediente
const actualizarExpediente = async (req, res) => {
    try {
        const { pacienteId } = req.params;
        const { observaciones } = req.body;

        const expediente = await Expediente.findOne({ where: { pacienteId } });
        if (!expediente) {
            return res.status(404).json({ mensaje: 'Expediente no encontrado' });
        }

        await expediente.update({ observaciones });

        res.json({ mensaje: 'Expediente actualizado exitosamente', expediente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { crearExpediente, obtenerExpediente, actualizarExpediente };