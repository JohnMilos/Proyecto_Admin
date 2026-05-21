/**
 * Interface for User Repository
 * @interface IUserRepository
 */
class IUserRepository {
    async save(user) { throw new Error('Method not implemented'); }
    async findById(id) { throw new Error('Method not implemented'); }
    async findByEmail(email) { throw new Error('Method not implemented'); }
    async findByPhone(phone) { throw new Error('Method not implemented'); }
    async findAll(role, isActive) { throw new Error('Method not implemented'); }
    async findByRole(role) { throw new Error('Method not implemented'); }
    async update(user) { throw new Error('Method not implemented'); }
    async delete(id) { throw new Error('Method not implemented'); }
    async exists(email, phone) { throw new Error('Method not implemented'); }
}

module.exports = IUserRepository;