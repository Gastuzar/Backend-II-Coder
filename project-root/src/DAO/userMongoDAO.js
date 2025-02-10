import { usersModel as usuariosModelo } from "./models/user.js";

export class usuariosMongoDAO {
    static async getUsers() {
        return await usuariosModelo.find().lean();
    }

    static async getUserById(id) {
        return await usuariosModelo.findById(id).lean();
    }

    static async getUserByEmail(email) {
        return await usuariosModelo.findOne({ email }).lean();
    }

    static async createUser(usuario) {
        return await usuariosModelo.create(usuario);
    }

    static async updateUser(id, usuario) {
        return await usuariosModelo.findByIdAndUpdate(id, usuario, { new: true }).lean();
    }
}



