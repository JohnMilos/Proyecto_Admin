class LoginUseCase {
    constructor(userRepository, tokenGenerator) {
        this.userRepository = userRepository;
        this.tokenGenerator = tokenGenerator;
    }

    async execute(request) {
        const { email, password } = request;

        // 1. Buscar usuario por email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // 2. Verificar contraseña
        const isValidPassword = user.password.validate(password);
        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }

        // 3. Verificar que la cuenta esté activa
        if (!user.isActive) {
            throw new Error('Cuenta desactivada. Contacte al administrador');
        }

        // 4. Generar token
        const token = this.tokenGenerator(user.id);

        return {
            user: user.toJSON(),
            token,
        };
    }
}

module.exports = LoginUseCase;