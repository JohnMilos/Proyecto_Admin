class RegisterUseCase {
    constructor(userRepository, tokenGenerator) {
        this.userRepository = userRepository;
        this.tokenGenerator = tokenGenerator;
    }

    async execute(request) {
        // 1. Validar que no exista el usuario
        const exists = await this.userRepository.exists(request.email, request.phone);
        if (exists) {
            throw new Error('Ya existe un usuario con este email o teléfono');
        }

        // 2. Validar especialidad para dentistas
        const role = request.role || 'patient';
        if (role === 'dentist' && !request.specialty) {
            throw new Error('La especialidad es requerida para dentistas');
        }

        // 3. Crear entidad User
        const User = require('../../entities/User');
        const user = User.create({
            name: request.name,
            email: request.email,
            phone: request.phone,
            password: request.password,
            role: role,
            specialty: request.specialty,
        });

        // 4. Guardar en repositorio
        const savedUser = await this.userRepository.save(user);

        // 5. Generar token
        const token = this.tokenGenerator(savedUser.id);

        return {
            user: savedUser.toJSON(),
            token,
        };
    }
}

module.exports = RegisterUseCase;