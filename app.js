import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { iniciarPassport } from './config/passport.js';
import sessionRoutes from './routes/sessions.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import { jwtSecret } from './utils.js';

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


iniciarPassport();
app.use(passport.initialize());


app.use('/api/sessions', sessionRoutes);
app.use('/', require('./routes/views.router'));


mongoose.connect('mongodb+srv://gastonzarate25:323283Gz@cluster0.6rk5z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() =>{ console.log('MongoDB connected')

}).catch(error => console.log("La conexion a la base de datos fallo", error));

    app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
});



    app.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    if (!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ error: "El correo electrónico ya existe" });
    }

    try {
        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
        await newUser.save(); 
        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get(
    '/user',
    passport.authenticate('current', { session: false }), 
    (req, res) => {
        res.status(200).json({
        mensaje: 'Perfil usuario',
        datosUsuario: req.user, 
        
        });
    }
);


app.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!email || !password) {
        return res.status(401).json({ error: "Credenciales inválidas" });
        }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({ error: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret , { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.status(200).json({ message: "Login exitoso", token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});
