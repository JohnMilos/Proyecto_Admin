const { Op } = require('sequelize');
const PenaltyModel = require('../sequelize/models/PenaltyModel');
const Penalty = require('../../../domain/entities/Penalty');

class PenaltyRepository {
    async save(penalty) {
        const PenaltyModelClass = PenaltyModel.getModel();
        const data = {
            userId: penalty.userId,
            reason: penalty.reason,
            amount: penalty.amount,
            status: penalty.status,
            expiresAt: penalty.expiresAt,
        };

        const created = await PenaltyModelClass.create(data);

        return Penalty.restore({
            id: created.id,
            userId: created.userId,
            reason: created.reason,
            amount: created.amount,
            status: created.status,
            expiresAt: created.expiresAt,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }

    async findById(id) {
        const PenaltyModelClass = PenaltyModel.getModel();
        const penalty = await PenaltyModelClass.findByPk(id);
        if (!penalty) return null;

        return Penalty.restore({
            id: penalty.id,
            userId: penalty.userId,
            reason: penalty.reason,
            amount: penalty.amount,
            status: penalty.status,
            expiresAt: penalty.expiresAt,
            createdAt: penalty.createdAt,
            updatedAt: penalty.updatedAt,
        });
    }

    async findByUserId(userId, status = null) {
        const PenaltyModelClass = PenaltyModel.getModel();
        const where = { userId };
        if (status) where.status = status;

        const penalties = await PenaltyModelClass.findAll({
            where,
            order: [['createdAt', 'DESC']],
        });

        return penalties.map(p => Penalty.restore({
            id: p.id,
            userId: p.userId,
            reason: p.reason,
            amount: p.amount,
            status: p.status,
            expiresAt: p.expiresAt,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }

    async findActiveByUserId(userId) {
        const PenaltyModelClass = PenaltyModel.getModel();
        const penalty = await PenaltyModelClass.findOne({
            where: {
                userId,
                status: 'active',
            },
        });
        if (!penalty) return null;

        return Penalty.restore({
            id: penalty.id,
            userId: penalty.userId,
            reason: penalty.reason,
            amount: penalty.amount,
            status: penalty.status,
            expiresAt: penalty.expiresAt,
            createdAt: penalty.createdAt,
            updatedAt: penalty.updatedAt,
        });
    }

    async update(penalty) {
        const PenaltyModelClass = PenaltyModel.getModel();
        await PenaltyModelClass.update(
            {
                status: penalty.status,
                expiresAt: penalty.expiresAt,
            },
            { where: { id: penalty.id } }
        );
        return penalty;
    }

    async delete(id) {
        const PenaltyModelClass = PenaltyModel.getModel();
        await PenaltyModelClass.destroy({ where: { id } });
    }
}

module.exports = PenaltyRepository;