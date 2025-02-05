import Cart from '../DAO/models/cartsModel.js'; 
import Product from '../DAO/models/productsModel.js';
import Ticket from '../DAO/models/ticketModel.js';
import { procesaErrores } from '../utils.js';
import mongoose from 'mongoose';


import { isValidObjectId } from 'mongoose';

export const addProductToCart = async (req, res) => {
    try {

        const { cid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cid)) {
            return res.status(400).json({ message: "ID de carrito inválido" });
        }

        let cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        procesaErrores(error, res);
    }
};

export const finalizarCompra = async (req, res) => {
    try {
        const { cid } = req.params;

        if (!isValidObjectId(cid)) {
            return res.status(400).json({ message: 'ID de carrito inválido' });
        }

        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        let total = 0;
        const productosNoProcesados = [];


        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                await item.product.save();
                total += item.product.price * item.quantity;
            } else {
                productosNoProcesados.push(item.product._id);
            }
        }


        cart.products = cart.products.filter(item => !productosNoProcesados.includes(item.product._id));
        await cart.save();

        const ticket = await Ticket.create({
            amount: total,
            purchaser: req.user.email
        });

        res.status(200).json({
            message: 'Compra realizada',
            ticket,
            productosNoProcesados
        });
    } catch (error) {
        procesaErrores(error, res);
    }
};

export const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json({ carts });
    } catch (error) {
        procesaErrores(error, res);
    }
};


export const getCartById = async (req, res) => {
    const { cid } = req.params;
    if (!isValidObjectId(cid)) {
        return res.status(400).json({ message: 'ID de carrito inválido' });
    }

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart);
    } catch (error) {
        procesaErrores(error, res);
    }
};


export const createCart = async (req, res) => {
    try {
        const newCart = new Cart({
            products: []
        });
        await newCart.save();
        res.status(201).json({ newCart });
    } catch (error) {
        procesaErrores(error, res);
    }
};


export const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;  
    
    if (!Array.isArray(products)) {
        return res.status(400).json({ message: 'El body debe contener un array de productos válidos' });
    }

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: `No existe carrito con id ${cid}` });
        }

        let error = false;
        for (let i = 0; i < products.length; i++) {
            if (!isValidObjectId(products[i].product)) {
                error = true;
            }
            if (typeof products[i].quantity !== 'number' || products[i].quantity <= 0) {
                error = true;
            }
        }

        if (error) {
            return res.status(400).json({ message: 'Uno o más productos tienen información inválida' });
        }

        cart.products = products;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        procesaErrores(error, res);
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cid, productId } = req.params;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.products.splice(productIndex, 1);  
        await cart.save();

        res.status(200).json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        procesaErrores(error, res);
    }
};
