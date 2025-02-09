import { productoModelo as Product } from '../DAO/models/productsModel.js';



export class ProductosDAO{
    static async getAllProducts(){
        return await Product.find().lean(); 
    };

    static async createNewProduct(product){
        let productData = await Product.create(product);       
        return productData;
    };


    static async updateProduct(id, product){
        let updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        return updatedProduct;
    };

    static async deleteProduct(id){
        let deletedProduct = await Product.findByIdAndDelete(id);
        return deletedProduct;
    }; 
    static async getProductById(id){
        let product = await Product.findById(id);
        return product;
    };
}