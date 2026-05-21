/**
 * Interface for Penalty Repository
 * @interface IPenaltyRepository
 */
class IPenaltyRepository {
    async save(penalty) { throw new Error('Method not implemented'); }
    async findById(id) { throw new Error('Method not implemented'); }
    async findByUserId(userId, status) { throw new Error('Method not implemented'); }
    async findActiveByUserId(userId) { throw new Error('Method not implemented'); }
    async update(penalty) { throw new Error('Method not implemented'); }
    async delete(id) { throw new Error('Method not implemented'); }
}

module.exports = IPenaltyRepository;