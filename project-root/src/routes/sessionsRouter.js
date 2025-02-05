import { Router } from 'express';
import { login, register, logout } from '../controllers/authController.js';
import passport from 'passport';
import { userDTO } from '../DTO/userDTO.js';
import { auth } from '../middleware/auth.js';


export const router=Router()

router.post('/login', login);
router.post('/register', register);
router.post('/logout',logout);

router.get('/current',
    passport.authenticate('jwt', { session: false }),
    auth(["admin"]),
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
