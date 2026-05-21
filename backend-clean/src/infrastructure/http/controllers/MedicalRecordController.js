const ApiResponse = require('../dtos/responses/ApiResponse');

class MedicalRecordController {
    constructor(createMedicalRecordUseCase, getMedicalRecordUseCase, updateMedicalRecordUseCase) {
        this.createMedicalRecordUseCase = createMedicalRecordUseCase;
        this.getMedicalRecordUseCase = getMedicalRecordUseCase;
        this.updateMedicalRecordUseCase = updateMedicalRecordUseCase;
    }

    async create(req, res) {
        try {
            const result = await this.createMedicalRecordUseCase.execute({
                patientId: req.body.patientId,
                diagnosis: req.body.diagnosis,
                treatment: req.body.treatment,
                prescriptions: req.body.prescriptions,
                notes: req.body.notes,
                userId: req.user.id,
                userRole: req.user.role,
            });
            res.status(201).json(ApiResponse.success('Expediente médico creado exitosamente', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async getByPatient(req, res) {
        try {
            const result = await this.getMedicalRecordUseCase.execute({
                patientId: parseInt(req.params.patientId),
                userId: req.user.id,
                userRole: req.user.role,
            });
            res.json(ApiResponse.success('Expedientes obtenidos exitosamente', result));
        } catch (error) {
            res.status(403).json(ApiResponse.error(error.message));
        }
    }

    async getById(req, res) {
        try {
            const result = await this.getMedicalRecordUseCase.execute({
                recordId: parseInt(req.params.id),
                userId: req.user.id,
                userRole: req.user.role,
            });
            res.json(ApiResponse.success('Expediente obtenido exitosamente', result));
        } catch (error) {
            res.status(404).json(ApiResponse.error(error.message));
        }
    }

    async update(req, res) {
        try {
            const result = await this.updateMedicalRecordUseCase.execute({
                recordId: parseInt(req.params.id),
                diagnosis: req.body.diagnosis,
                treatment: req.body.treatment,
                prescriptions: req.body.prescriptions,
                notes: req.body.notes,
                userRole: req.user.role,
            });
            res.json(ApiResponse.success('Expediente médico actualizado exitosamente', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }
}

module.exports = MedicalRecordController;