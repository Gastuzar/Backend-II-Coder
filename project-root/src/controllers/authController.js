import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import { procesaErrores } from '../utils.js';
import { userDTO } from '../DTO/userDTO.js';
import { usuariosMongoDAO } from '../DAO/userMongoDAO.js';
import { CartsDAO as Cart } from '../DAO/cartsDAO.js'; 

export class AuthController {
    static async login(req, res) {
        try { 
        let user = await usuariosMongoDAO.getUserByEmail(req.body.email);
            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

        const validPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credencial invalida' });
        }
        if (!user.cart) {
            const newCart = await Cart.addCart();

            await usuariosMongoDAO.updateUser(user._id, { cart: newCart._id });
        }
        let token = jwt.sign(
            { id: user._id, role: user.role },
            config.SECRET,
            { expiresIn: config.EXPIRACION }
        );

        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, secure: false });
        res.json({
            message: 'Login exitoso',
            user: new userDTO(user)
        });
        } catch (error) {
        procesaErrores(error, res);
        }
    }

    static async register(req, res) {
        try {
            const saltRounds = 10;
            req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
            
            let userRegistered = await usuariosMongoDAO.createUser(req.body);
            const newCart = await Cart.addCart();
            userRegistered.cart = newCart._id;

            
            let token = jwt.sign(
                { id: userRegistered._id, role: userRegistered.role },
                config.SECRET,
                { expiresIn: config.EXPIRACION }
            );
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000, secure: false });
            return res.json({
                message: 'Registro exitoso',
                user: new userDTO(userRegistered)
            });
        } catch (err) {
            procesaErrores(err, res);
        }
    }

    static async logout(req, res) {
        try {
            let token = req.cookies.jwt;  
            if (token) {
                res.clearCookie('jwt');


                if (req.user && req.user.cart) { 
                    await Cart.deleteCart(req.user.cart); 
                    req.user.cart = null;  
                    await req.user.save();  
                }

                return res.json({ message: 'Logout exitoso' }); 
            } else {
                return res.status(400).json({ message: 'No se encontró token de sesión' });
            }
        } catch (error) {
            procesaErrores(error, res);
        }
    }
}
