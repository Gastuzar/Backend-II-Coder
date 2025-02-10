import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import { userDTO } from '../DTO/userDTO.js';
import { usuariosMongoDAO as DAO } from "../DAO/userMongoDAO.js";
import { CartsDAO as Cart } from '../DAO/cartsDAO.js';

class UsuariosService {
    async getUsers() {
        return await DAO.getUsers();
    }

    async getUserById(id) {
        return await DAO.getUserById(id);
    }

    async getUserByEmail(email) {
        return await DAO.getUserByEmail(email);
    }

    async createUser(data) {
        data.password = bcrypt.hashSync(data.password, 10);

        let newUser = await DAO.createUser(data);

        const newCart = await Cart.addCart();
        await DAO.updateUser(newUser._id, { cart: newCart._id });

        return this.generateAuthResponse(newUser);
    }

    async loginUser(email, password) {
        const user = await DAO.getUserByEmail(email);
        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error("Credenciales inválidas");
        }

        if (!user.cart) {
            const newCart = await Cart.addCart();
            await DAO.updateUser(user._id, { cart: newCart._id });
        }

        return this.generateAuthResponse(user);
    }

    async logoutUser(user) {
        if (user?.cart) {
            await Cart.deleteCart(user.cart);
            await DAO.updateUser(user._id, { cart: null });
        }
    }

    generateAuthResponse(user) {
        const token = jwt.sign(
            { id: user._id, role: user.role },
            config.SECRET,
            { expiresIn: config.EXPIRACION }
        );

        return { user: new userDTO(user), token };
    }
}

export const usuariosService = new UsuariosService();
