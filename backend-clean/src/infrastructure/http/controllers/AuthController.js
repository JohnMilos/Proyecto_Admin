const ApiResponse = require('../dtos/responses/ApiResponse');

class AuthController {
    constructor(registerUseCase, loginUseCase, getProfileUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.getProfileUseCase = getProfileUseCase;
    }

    async register(req, res) {
        try {
            const result = await this.registerUseCase.execute(req.body);
            res.status(201).json(ApiResponse.success('Usuario registrado exitosamente', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async login(req, res) {
        try {
            const result = await this.loginUseCase.execute(req.body);
            res.json(ApiResponse.success('Login exitoso', result));
        } catch (error) {
            res.status(401).json(ApiResponse.error(error.message));
        }
    }

    async getProfile(req, res) {
        try {
            const user = await this.getProfileUseCase.execute(req.user.id);
            res.json(ApiResponse.success('Perfil obtenido exitosamente', { user }));
        } catch (error) {
            res.status(404).json(ApiResponse.error(error.message));
        }
    }

    async getActiveDentists(req, res) {
        try {
            const dentists = await this.getActiveDentistsUseCase.execute();
            res.json(ApiResponse.success('Dentistas obtenidos exitosamente', dentists));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.getAllUsersUseCase.execute(req.query.q);
            res.json(ApiResponse.success('Usuarios obtenidos exitosamente', users));
        } catch (error) {
            res.status(500).json(ApiResponse.error(error.message));
        }
    }

    async deactivateUser(req, res) {
        try {
            const result = await this.deactivateUserUseCase.execute({
                userId: req.params.userId,
                isActive: req.body.isActive,
                adminId: req.user.id,
            });
            res.json(ApiResponse.success(`Usuario ${result.isActive ? 'activado' : 'desactivado'} exitosamente`, result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }

    async deleteUser(req, res) {
        try {
            const result = await this.deleteUserUseCase.execute({
                userId: req.params.userId,
                adminId: req.user.id,
            });
            res.json(ApiResponse.success('Usuario eliminado exitosamente', result));
        } catch (error) {
            res.status(400).json(ApiResponse.error(error.message));
        }
    }
}

module.exports = AuthController;