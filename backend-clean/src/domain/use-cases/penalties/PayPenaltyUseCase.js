class PayPenaltyUseCase {
    constructor(penaltyRepository) {
        this.penaltyRepository = penaltyRepository;
    }

    async execute(request) {
        const { penaltyId, userId } = request;

        // 1. Obtener la penalización
        const penalty = await this.penaltyRepository.findById(penaltyId);
        if (!penalty) {
            throw new Error('Penalización no encontrada');
        }

        // 2. Verificar que pertenece al usuario
        if (penalty.userId !== userId) {
            throw new Error('No tiene permisos para pagar esta penalización');
        }

        // 3. Verificar que está activa
        if (!penalty.isActive()) {
            throw new Error('Esta penalización ya fue pagada o está inactiva');
        }

        // 4. Pagar
        penalty.pay();
        const updated = await this.penaltyRepository.update(penalty);

        return {
            penalty: updated.toJSON(),
        };
    }
}

module.exports = PayPenaltyUseCase;