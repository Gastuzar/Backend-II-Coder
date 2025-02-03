import express from 'express';
import passport, { iniciarPassport } from './config/passport.js';
import sessionsRouter from './routes/sessionsRouter.js';
import cookieParser from 'cookie-parser';
import { conectarDB } from './ConnDB.js';
import { config } from './config/config.js';

const PORT = config.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

iniciarPassport();
app.use(passport.initialize());



app.use('/api/sessions', sessionsRouter);

app.get('/', (req, res) => {
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto:${PORT}`);
});

conectarDB(config.MONGO_URL, config.DB_NAME)