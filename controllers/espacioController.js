const EspacioDisponible = require('../models/EspacioDisponible');
const { Op } = require('sequelize');

// Crear espacio disponible
const crearEspacio = async (req, res) => {
    try {
        const { fecha, horaInicio, horaFin } = req.body;
        const profesionalId = req.usuario.id;

        // Validar que no se traslape con otro espacio del mismo profesional
        const espacioTraslapado = await EspacioDisponible.findOne({
            where: {
                profesionalId,
                fecha,
                [Op.or]: [
                    {
                        horaInicio: { [Op.between]: [horaInicio, horaFin] },
                    },
                    {
                        horaFin: { [Op.between]: [horaInicio, horaFin] },
                    },
                    {
                        [Op.and]: [
                            { horaInicio: { [Op.lte]: horaInicio } },
                            { horaFin: { [Op.gte]: horaFin } },
                        ],
                    },
                ],
            },
        });
        if (espacioTraslapado) {
            return res.status(400).json({ mensaje: 'El espacio se traslapa con otro existente' });
        }

        const espacio = await EspacioDisponible.create({
            profesionalId,
            fecha,
            horaInicio,
            horaFin,
        });

        res.status(201).json({ mensaje: 'Espacio creado exitosamente', espacio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Obtener espacios del profesional
const obtenerEspacios = async (req, res) => {
    try {
        const espacios = await EspacioDisponible.findAll({
            where: { profesionalId: req.usuario.id },
        });
        res.json(espacios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Actualizar espacio disponible
const actualizarEspacio = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, horaInicio, horaFin } = req.body;

        const espacio = await EspacioDisponible.findByPk(id);
        if (!espacio) {
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }

        // Verificar que el espacio no esté ocupado
        if (espacio.estado === 'ocupado') {
            return res.status(400).json({ mensaje: 'No se puede actualizar un espacio ocupado' });
        }

        // Validar que no se traslape con otro espacio del mismo profesional
        const espacioTraslapado = await EspacioDisponible.findOne({
            where: {
                profesionalId: req.usuario.id,
                fecha,
                id: { [Op.ne]: id },
                [Op.or]: [
                    {
                        horaInicio: { [Op.between]: [horaInicio, horaFin] },
                    },
                    {
                        horaFin: { [Op.between]: [horaInicio, horaFin] },
                    },
                    {
                        [Op.and]: [
                            { horaInicio: { [Op.lte]: horaInicio } },
                            { horaFin: { [Op.gte]: horaFin } },
                        ],
                    },
                ],
            },
        });
        if (espacioTraslapado) {
            return res.status(400).json({ mensaje: 'El espacio se traslapa con otro existente' });
        }

        await espacio.update({
            fecha: fecha || espacio.fecha,
            horaInicio: horaInicio || espacio.horaInicio,
            horaFin: horaFin || espacio.horaFin,
        });

        res.json({ mensaje: 'Espacio actualizado exitosamente', espacio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

// Eliminar espacio disponible
const eliminarEspacio = async (req, res) => {
    try {
        const { id } = req.params;

        const espacio = await EspacioDisponible.findByPk(id);
        if (!espacio) {
            return res.status(404).json({ mensaje: 'Espacio no encontrado' });
        }

        // Verificar que el espacio no esté ocupado
        if (espacio.estado === 'ocupado') {
            return res.status(400).json({ mensaje: 'No se puede eliminar un espacio ocupado' });
        }

        await espacio.destroy();
        res.json({ mensaje: 'Espacio eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

module.exports = { crearEspacio, obtenerEspacios, actualizarEspacio, eliminarEspacio };