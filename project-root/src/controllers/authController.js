import { usuariosService } from "../services/user.service.js";

export class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { user, token } = await usuariosService.loginUser(email, password);

            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, secure: false });
            res.json({ message: 'Login exitoso', user });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    static async register(req, res) {
        try {
            const { user, token } = await usuariosService.createUser(req.body);

            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, secure: false });
            res.json({ message: 'Registro exitoso', user });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    static async logout(req, res) {
        try {
            if (req.cookies.jwt) {
                res.clearCookie('jwt');
                await usuariosService.logoutUser(req.user);
                return res.json({ message: 'Logout exitoso' });
            }
            return res.status(400).json({ message: 'No se encontró token de sesión' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
