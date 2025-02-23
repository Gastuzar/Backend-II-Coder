
export const auth = (permisos = []) => {
    return (req, res, next) => {

        if (!Array.isArray(permisos)) {
            return res.status(500).json({ error: `Error de permisos para la ruta.` });
        }

        if (permisos.includes("public")) {
            return next();
        }

        if (!req.user) {
            return res.status(401).json({ error: `No hay usuarios autenticados` });
        }

        if (!req.user.role || !permisos.includes(req.user.role.toLowerCase())) {
            return res.status(403).json({ error: `No tiene privilegios suficientes para acceder al recurso solicitado` });
        }

        next();
    };
};