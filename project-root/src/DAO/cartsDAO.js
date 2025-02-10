import { cartsModel as Cart } from '../DAO/models/cartsModel.js';

export class CartsDAO {
    static async getCart() {  
        return await Cart.find().lean();
    }
    
    static async getCartById(cartId) {
    return await Cart.findById(cartId).populate('products.product');
}

    
    static async addCart() {
        return await Cart.create({});
    }

    static async updateCart(id, cart) {
        return await Cart.findByIdAndUpdate(id, cart, { new: true });
    }

    static async deleteCart(id) {
        return await Cart.findByIdAndDelete(id);
    }

    static async addProductToCart(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
            await cart.save();
            return cart;
        } else {
            cart.products.push({ product: productId, quantity });
            await cart.save();
            return cart;
        }
    }

    static async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);

            if (!cart) {
                return null; 
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                return null; 
            }
    
            cart.products.splice(productIndex, 1); 
    
            await cart.save();
    
            return cart; 
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            return null;
        }
    }                  
}

