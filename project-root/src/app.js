import express from 'express';
import cookieParser from 'cookie-parser';
import { conectarDB } from './ConnDB.js';
import { config } from './config/config.js';
import sessionsRouter from './routes/sessionsRouter.js';
import productsRouter from './routes/productsRoutes.js';
import cartsRouter from './routes/cartRoutes.js';
import { iniciarPassport } from './config/passport.js';
import passport from 'passport';

const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

iniciarPassport();
app.use(passport.initialize());


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/sessions', sessionsRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Error inesperado en el servidor' });
});


app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto:${PORT}`);
});

conectarDB(config.MONGO_URL, config.DB_NAME)

//{ "email": "gastonz1@admin.com", "password": "123456" }