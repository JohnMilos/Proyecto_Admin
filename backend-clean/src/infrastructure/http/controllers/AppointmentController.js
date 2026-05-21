const ApiResponse = require('../dtos/responses/ApiResponse');

class AppointmentController {
    constructor(
        createAppointmentUseCase,
        cancelAppointmentUseCase,
        rescheduleAppointmentUseCase,
        getAppointmentsUseCase,
        getOccupiedSlotsUseCase,
        completeAppointmentUseCase
    ) {
        this.createAppointmentUseCase = createAppointmentUseCase;
        this.cancelAppointmentUseCase = cancelAppointmentUseCase;
        this.rescheduleAppointmentUseCase = rescheduleAppointmentUseCase;
        this.getAppointmentsUseCase = getAppointmentsUseCase;
        this.getOccupiedSlotsUseCase = getOccupiedSlotsUseCase;
        this.completeAppointmentUseCase = completeAppointmentUseCase;
    }

    async create(req, res) {
        try {
            const result = await this.createAppointmentUseCase.execute({
                patientId: req.user.id,
                dentistId: req.body.dentistId,
                date: new Date(req.body.date),
                type: req.body.type || 'first_visit',
                notes: req.body.notes,
            });
            res.status(201).json(ApiResponse.success('Cita agendada exitosamente', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async getAll(req, res) {
        try {
            const result = await this.getAppointmentsUseCase.execute({
                userId: req.user.id,
                userRole: req.user.role,
                status: req.query.status,
                dentistId: req.query.dentistId ? parseInt(req.query.dentistId) : undefined,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
            });
            res.json(ApiResponse.success('Citas obtenidas exitosamente', result));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async cancel(req, res) {
        try {
            const result = await this.cancelAppointmentUseCase.execute({
                appointmentId: parseInt(req.params.id),
                userId: req.user.id,
                userRole: req.user.role,
            });
            res.json(ApiResponse.success(result.message, result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async reschedule(req, res) {
        try {
            const result = await this.rescheduleAppointmentUseCase.execute({
                appointmentId: parseInt(req.params.id),
                userId: req.user.id,
                newDate: new Date(req.body.newAppointmentDate),
            });
            res.json(ApiResponse.success('Cita reagendada exitosamente', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async getOccupiedSlots(req, res) {
        try {
            const result = await this.getOccupiedSlotsUseCase.execute({
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
                dentistId: req.query.dentistId ? parseInt(req.query.dentistId) : undefined,
            });
            res.json(ApiResponse.success('Horas ocupadas obtenidas exitosamente', result));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async complete(req, res) {
        try {
            const result = await this.completeAppointmentUseCase.execute({
                appointmentId: parseInt(req.params.id),
                userId: req.user.id,
                userRole: req.user.role,
                notes: req.body.notes,
            });
            res.json(ApiResponse.success('Cita marcada como completada', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }
}

module.exports = AppointmentController;