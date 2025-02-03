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
    passport.authenticate('current', { session: false }),
    auth(["admin"]),
    (req, res) => {
        res.status(200).json({
            message: 'Perfil usuario',
            user: new userDTO(req.user)
        });
    }
);

// router.get('/admin-only',
//     passport.authenticate('current', { session: false }),
//     auth(["admin"]), 
//     (req, res) => {
//         res.status(200).json({ message: 'Bienvenido, admin!' });
//     }
// );

// router.get('/admin-only',
//     passport.authenticate('current', { session: false }),
//     auth(["admin"]), 
//     (req, res) => {
//         res.status(200).json({ message: 'Bienvenido, admin!' });
//     }
// );

export default router;
