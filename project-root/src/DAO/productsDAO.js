
import Product from '../DAO/models/productsModel.js';

export const getAllProducts = async () => {
    return await Product.find().lean(); 
};

export const createNewProduct = async (productData) => {
    return await Product.create(productData);
};


export const getProductByCode = async (code) => {
    return await Product.findOne({ code }).lean();
};