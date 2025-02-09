import { ProductosDAO as Product } from '../DAO/productsDAO.js';
import { procesaErrores } from '../utils.js';


export class ProductsController {
    static async  getProducts(req, res){
        try {
            let productos = await Product.getAllProducts();
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({ productos });
        } catch (error) {
            procesaErrores(error, res);
        }
    };
    
    static async createProduct(req, res){
        try {
            console.log("Usuario autenticado en createProduct:", req.user); 
            let productData = req.body;
            let newProduct = await Product.createNewProduct(productData);
            return res.status(201).json(newProduct);
        } catch (error) {
            console.error("Error al crear producto:", error);
            procesaErrores(error, res);
        }
    };    
    
    static async updateProduct(req, res){
        try {
            let updatedProduct = await Product.updateProduct(req.params.id, req.body);
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({ updatedProduct });
        } catch (error) {
            procesaErrores(error, res);
        }
    };
    
    static async deleteProduct(req, res){
        try {
            let eliminarProducto = await Product.deleteProduct(req.params.id);
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({ eliminarProducto });
        } catch (error) {
            procesaErrores(error, res);
        }
    };
}
