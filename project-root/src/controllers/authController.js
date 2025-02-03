import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../DAO/models/user.js';
import { config } from '../config/config.js';
import { procesaErrores } from '../utils.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const newPass = bcrypt.compareSync(password, user.password);
        if (!newPass) {
            return res.status(401).json({ message: 'Credencial invalida' });
        }

        const token = jwt.sign({ id: user._id }, config.SECRET, { expiresIn: config.EXPIRACION });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); 
        res.json({
            message: 'Login exitoso',
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        procesaErrores(error, res);
    }
};

export const register = async (req, res) => {
    const { first_name, last_name, email, password, age, role } = req.body;

    try {
        if (!first_name || !last_name || !email || !password || !age) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario con ese correo ya existe' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            age,
            role: role || 'user' 
        });

        await newUser.save();

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        procesaErrores(err, res);
    }
};

export const logout = (req, res) => {    
    res.clearCookie('cookietoken'); 
    res.json({ message: 'Logout exitoso' });
};