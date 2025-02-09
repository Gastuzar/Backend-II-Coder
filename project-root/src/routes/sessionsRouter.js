import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import passport from 'passport';
import { userDTO } from '../DTO/userDTO.js';

export const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/logout', AuthController.logout);

router.get('/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (!req.user) {
        return res.status(401).json({ error: "No se pudo autenticar al usuario" });
        }
        res.status(200).json({
        message: 'Perfil usuario',
        user: new userDTO(req.user)
        });
    }
);

export default router;
