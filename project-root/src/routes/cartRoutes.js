import { Router } from 'express';
import passport from 'passport';
import { auth } from '../middleware/auth.js';
import { addProductToCart, finalizarCompra, getCarts, getCartById, createCart, updateCart, removeProductFromCart } from '../controllers/cartsController.js';

const router = Router();

//carritos
router.get('/', passport.authenticate('jwt', { session: false }), auth(['admin']), getCarts);
//carrito por ID
router.get('/:cid', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), getCartById);
//crear un nuevo carrito vacío
router.post('/', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), createCart);
//agregar un producto al carrito
router.post('/:cid/add-product', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), addProductToCart);
//actualizar el carrito
router.put('/:cid', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), updateCart);
//eliminar un producto del carrito
router.delete('/:cid/remove-product/:productId', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), removeProductFromCart);
//finalizar la compra
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), finalizarCompra);

export default router;
