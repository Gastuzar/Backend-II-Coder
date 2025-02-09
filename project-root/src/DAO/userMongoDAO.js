import { usersModel as usuariosModelo } from "./models/user.js";

console.log("Persistencia en MongoDB iniciada");

export class usuariosMongoDAO {
    static async getUsers() {
        return await usuariosModelo.find().lean();
    }

    static async getUserByEmail(email) {
        return await usuariosModelo.findOne({ email }).lean();
    }
    static async createUser(usuario) {
        let usuarioCreado = await usuariosModelo.create(usuario);
        return usuarioCreado;
    }

    static async updateUser(id, usuario) {
        let usuarioActualizado = await usuariosModelo.findByIdAndUpdate(id, usuario, { new: true });
        return usuarioActualizado;
    }
}


