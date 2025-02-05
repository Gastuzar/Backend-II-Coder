import Cart from '../DAO/models/cartsModel.js';

export const getCartById = async (cartId) => {
    return await Cart.findById(cartId).populate('products.product');
};

export const saveCart = async (cart) => {
    return await cart.save();
};