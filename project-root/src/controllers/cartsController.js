import { CartsDAO as Cart } from '../DAO/cartsDAO.js';
import Ticket from '../DAO/models/ticketModel.js';
import { procesaErrores } from '../utils.js';
import { ProductosDAO } from '../DAO/productsDAO.js';
import { isValidObjectId } from "mongoose";
export class CartsController {
    static async addProductToCart(req, res) {
        try {
            let cartId = req.params.cid;  
            let productId = req.body.productId; 
            let quantity = parseInt(req.body.quantity); 
    
            if (!cartId) return res.status(400).json({ message: "El ID del carrito es obligatorio" });
            if (!productId) return res.status(400).json({ message: "El ID del producto es obligatorio" });
            if (isNaN(quantity) || quantity < 0) return res.status(400).json({ message: "La cantidad debe ser un número mayor o igual a 0" });
    
            let cart = await Cart.getCartById(cartId);
            if (!cart) return res.status(404).json({ message: `No existe carrito con id ${cartId}` });
    
            let product = await ProductosDAO.getProductById(productId);
            if (!product) return res.status(404).json({ message: `No existe producto con id ${productId}` });

            if (product.stock < quantity) {
                return res.status(400).json({
                    message: `No hay suficiente stock. Solo quedan ${product.stock} unidades disponibles`
                });
            }
    
            product.stock -= quantity;
            await product.save();
    
            let updatedCart;
    
            if (quantity === 0) {
                updatedCart = await Cart.removeProductFromCart(cartId, productId);
            } else {
                updatedCart = await Cart.addProductToCart(cartId, productId, quantity);
            }
    
            if (!updatedCart) return res.status(500).json({ message: "No se pudo actualizar el carrito" });
    
            return res.status(200).json({ message: "Carrito actualizado", cart: updatedCart });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    static async getMyCart(req, res) {
        try {
            let cart = await Cart.getCartById(req.user.cart);
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({
                message: "Carrito del usuario",
                cart: cart
            });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    static async getCarts(req, res) {
        try {
            let carts = await Cart.getCart();
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ carts });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    static async getCartById(req, res) {
        try {
            const cartId = req.params.cid;
            let cart = await Cart.getCartById(cartId);
            res.setHeader('Content-Type', 'application/json');
            if (!cart) {
                return res.status(404).json({ message: `No existe carrito con id ${cartId}` });
            }

            return res.status(200).json({ cart });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    static async createCart(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: 'Usuario no autenticado' });
            }
    
            let newCart = await Cart.addCart();
    
            req.user.cart = newCart._id;  
            await req.user.save();  
    
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: 'Carrito creado y asociado al usuario', cart: newCart });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    static async updateMyCart(req, res) {
        try {
            const user = req.user;
            if (!user.cart) {
                return res.status(404).json({ message: "El usuario no tiene un carrito asociado" });
            }
    
            const cart = await Cart.getCartById(user.cart); 
            if (!cart) {
                return res.status(404).json({ message: "No se encontró el carrito del usuario" });
            }
    
            const product = req.body.productId;
            const quantity = parseInt(req.body.quantity);
    
            if (!product || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ message: "ID de producto y cantidad son requeridos" });
            }
    
            const existingProduct = cart.products.find(p => p.product.toString() === product);
            if (!existingProduct) {
                return res.status(404).json({ message: "Producto no encontrado en el carrito" });
            }

            const productInInventory = await ProductosDAO.getProductById(product); 
            if (!productInInventory) {
                return res.status(404).json({ message: "Producto no encontrado en el inventario" });
            }
    
            if (productInInventory.stock < quantity) {
                return res.status(400).json({ message: `No hay suficiente stock. Solo quedan ${productInInventory.stock} unidades disponibles` });
            }
    
            existingProduct.quantity = quantity;
            await cart.save();  
    
            return res.status(200).json({ message: "Cantidad del producto actualizada", cart });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    static async updatedIdCart(req, res) {
        try {
            const cartId = req.params.cid; 
            const cart = await Cart.getCartById(cartId); 
    
            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
    
            const product = req.body.productId;
            const quantity = parseInt(req.body.quantity);
    
            if (!product || isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ message: "ID de producto y cantidad son requeridos" });
            }
    
            const existingProduct = cart.products.find(p => p.product.toString() === product);
            if (!existingProduct) {
                return res.status(404).json({ message: "Producto no encontrado en el carrito" });
            }

            const productInInventory = await ProductosDAO.getProductById(product); 
            if (!productInInventory) {
                return res.status(404).json({ message: "Producto no encontrado en el inventario" });
            }
    
            if (productInInventory.stock < quantity) {
                return res.status(400).json({ message: `No hay suficiente stock. Solo quedan ${productInInventory.stock} unidades disponibles` });
            }
    

            existingProduct.quantity = quantity;
            await cart.save();
    
            return res.status(200).json({ message: "Cantidad del producto actualizada", cart });
        } catch (error) {
            procesaErrores(error, res);
        }
    }
    
    static async removeProductFromCart(req, res) {
        try {
            let cartId = req.params.cid;
            let cart = await Cart.getCartById(cartId);
            if (!cart) return res.status(404).json({ message: `No existe carrito con id ${cartId}` });
            await Cart.deleteCart(cartId);
            return res.status(200).json({ message: "Carrito eliminado" });
        } catch (error) {
            procesaErrores(error, res);
        }
    }       
    static async finalizarCompra(req, res) {
        try {
            const { cid } = req.params;
    
            if (!isValidObjectId(cid)) {
                return res.status(400).json({ error: "Ingrese un ID de carrito válido" });
            }
    
            if (!req.user.cart || req.user.cart.toString() !== cid.toString()) {
                return res.status(400).json({ error: "El carrito no pertenece al usuario autenticado" });
            }
    
            const cart = await Cart.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
    
            if (!cart.products || cart.products.length === 0) {
                return res.status(400).json({ error: "El carrito está vacío" });
            }
    
            let total = 0;
            const productosNoProcesados = [];
            const productosComprados = [];
    
            for (const item of cart.products) {
                const productDB = item.product;
    
                if (productDB.stock >= item.quantity) {
                    await ProductosDAO.updateProduct(productDB._id, { $inc: { stock: -item.quantity } });
    
                    total += productDB.price * item.quantity;
    
                    productosComprados.push({
                        _id: productDB._id,
                        title: productDB.title,
                        price: productDB.price,
                        cantidad: item.quantity,
                        subtotal: productDB.price * item.quantity
                    });
                } else {
                    productosNoProcesados.push(productDB._id);
                }
            }
    
            cart.products = cart.products.filter(item => !productosNoProcesados.includes(item.product._id));
    
            if (!cart.products) {
                return res.status(500).json({ error: "Error al actualizar el carrito" });
            }
    
            await cart.save();
    
            if (productosComprados.length === 0) {
                return res.status(400).json({ error: "No existen ítems en condiciones de ser adquiridos" });
            }
    
            const ticket = await Ticket.create({
                code: `TICKET-${Date.now()}`,
                purchase_datetime: new Date(),
                detalle: productosComprados,
                amount: total,
                comprador: req.user.email
            });
    
            res.status(200).json({
                message: "Compra realizada",
                ticket,
                productosNoProcesados
            });
    
        } catch (error) {
            procesaErrores(error, res);
        }
    }
}                
