import Product from '../DAO/models/productsModel.js';
import { procesaErrores } from '../utils.js';

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.status(200).json(products);
    } catch (error) {
        procesaErrores(error, res);
    }
};

export const createProduct = async (req, res) => {
    try {

        const productData = req.body;
        const newProduct = await Product.create(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error);
        procesaErrores(error, res);
    }
};



export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        procesaErrores(error, res);
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        procesaErrores(error, res);
    }
};