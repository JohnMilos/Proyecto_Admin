const { Op } = require('sequelize');
const UserModel = require('../sequelize/models/UserModel');
const User = require('../../../domain/entities/User');
const Email = require('../../../domain/value-objects/Email');
const PhoneNumber = require('../../../domain/value-objects/PhoneNumber');
const Password = require('../../../domain/value-objects/Password');

class UserRepository {
    async save(user) {
        const UserModelClass = UserModel.getModel();
        const userData = {
            name: user.name,
            email: user.email.value,
            phone: user.phone.value,
            password: user.password.value,
            role: user.role,
            specialty: user.specialty,
            isActive: user.isActive,
        };

        const created = await UserModelClass.create(userData);

        return User.restore({
            id: created.id,
            name: created.name,
            email: new Email(created.email),
            phone: new PhoneNumber(created.phone),
            password: new Password(created.password, true),
            role: created.role,
            specialty: created.specialty,
            isActive: created.isActive,
            createdAt: created.createdAt,
            updatedAt: created.updatedAt,
        });
    }

    async findById(id) {
        const UserModelClass = UserModel.getModel();
        const user = await UserModelClass.findByPk(id);
        if (!user) return null;

        return User.restore({
            id: user.id,
            name: user.name,
            email: new Email(user.email),
            phone: new PhoneNumber(user.phone),
            password: new Password(user.password, true),
            role: user.role,
            specialty: user.specialty,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async findByEmail(email) {
        const UserModelClass = UserModel.getModel();
        const user = await UserModelClass.findOne({
            where: { email: email.toLowerCase() }
        });
        if (!user) return null;

        return User.restore({
            id: user.id,
            name: user.name,
            email: new Email(user.email),
            phone: new PhoneNumber(user.phone),
            password: new Password(user.password, true),
            role: user.role,
            specialty: user.specialty,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async findByPhone(phone) {
        const UserModelClass = UserModel.getModel();
        const cleanedPhone = phone.replace(/\D/g, '');
        const user = await UserModelClass.findOne({
            where: { phone: cleanedPhone }
        });
        if (!user) return null;

        return User.restore({
            id: user.id,
            name: user.name,
            email: new Email(user.email),
            phone: new PhoneNumber(user.phone),
            password: new Password(user.password, true),
            role: user.role,
            specialty: user.specialty,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    async findAll(role, isActive) {
        const UserModelClass = UserModel.getModel();
        const where = {};
        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive;

        const users = await UserModelClass.findAll({ where });

        return users.map(user => User.restore({
            id: user.id,
            name: user.name,
            email: new Email(user.email),
            phone: new PhoneNumber(user.phone),
            password: new Password(user.password, true),
            role: user.role,
            specialty: user.specialty,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    async findByRole(role) {
        return this.findAll(role);
    }

    async update(user) {
        const UserModelClass = UserModel.getModel();
        await UserModelClass.update(
            {
                name: user.name,
                email: user.email.value,
                phone: user.phone.value,
                role: user.role,
                specialty: user.specialty,
                isActive: user.isActive,
            },
            { where: { id: user.id } }
        );
        return user;
    }

    async delete(id) {
        const UserModelClass = UserModel.getModel();
        await UserModelClass.destroy({ where: { id } });
    }

    async exists(email, phone) {
        const UserModelClass = UserModel.getModel();
        const cleanedPhone = phone.replace(/\D/g, '');
        const count = await UserModelClass.count({
            where: {
                [Op.or]: [
                    { email: email.toLowerCase() },
                    { phone: cleanedPhone },
                ],
            },
        });
        return count > 0;
    }
}

module.exports = UserRepository;