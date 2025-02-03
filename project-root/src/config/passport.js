import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../DAO/models/user.js';
import { config } from './config.js';

const buscaToken = (req) => {
    return req.cookies?.jwt || null; 
};

export const iniciarPassport = () => {
    passport.use("current",
        new JwtStrategy(
            { 
                secretOrKey: config.SECRET,
                jwtFromRequest: ExtractJwt.fromExtractors([buscaToken]) 
            },
            async (contenidoToken, done) => {
                try {
                    if (!contenidoToken) {
                        return done(null, false, { message: 'Token no proporcionado' });
                    }
                    const user = await User.findById(contenidoToken.id);
                    if (user) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Usuario no encontrado' });
                    }
                } catch (error) {
                    return done(error, false);
                }
            }
        )
    )
}

export default passport;