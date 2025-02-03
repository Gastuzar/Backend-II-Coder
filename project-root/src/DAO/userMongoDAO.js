import { userSchema as usuariosModelo } from "./models/user.js"

console.log("Persistencia en MongoDB iniciada")

export class usuariosMongoDAO{
    async get(){
        return await usuariosModelo.find().lean()
    }

    async getBy(filtro={}){
        return await usuariosModelo.findOne(filtro)
    }

    async create(usuario){
        let usuarioNuevo=await usuariosModelo.create(usuario)
        return usuarioNuevo.toJSON()
    }
}