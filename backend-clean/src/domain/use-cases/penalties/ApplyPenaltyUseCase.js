class ApplyPenaltyUseCase {
    constructor(penaltyRepository, userRepository) {
        this.penaltyRepository = penaltyRepository;
        this.userRepository = userRepository;
    }

    async execute(request) {
        const { userId, reason, amount, userRole } = request;

        // 1. Verificar permisos (solo admin)
        if (userRole !== 'admin') {
            throw new Error('Solo administradores pueden aplicar penalizaciones');
        }

        // 2. Verificar que el usuario existe
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // 3. Crear penalización
        const Penalty = require('../../entities/Penalty');
        const penalty = Penalty.create({
            userId,
            reason,
            amount,
            expiresAt: null,
        });

        // 4. Guardar
        const savedPenalty = await this.penaltyRepository.save(penalty);

        return {
            penalty: savedPenalty.toJSON(),
        };
    }
}

module.exports = ApplyPenaltyUseCase;