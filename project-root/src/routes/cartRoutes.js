import { Router } from 'express';
import passport from 'passport';
import { auth } from '../middleware/auth.js';
import { CartsController } from '../controllers/cartsController.js';

const router = Router();

//mi carrito
router.get('/', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.getMyCart);
//todos los carritos
router.get('/all', passport.authenticate('jwt', { session: false }), auth(['admin']), CartsController.getCarts);
//carrito por ID
router.get('/:cid', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.getCartById);
//crear un nuevo carrito vacío
router.post('/', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.createCart);
//agregar un producto al carrito
router.post('/:cid/add-product', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.addProductToCart);
//actualizar mi carrito
router.put('/', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.updateMyCart);
//actualizar carrito por id
router.put('/:cid', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.updatedIdCart);
//eliminar un producto del carrito
router.delete('/:cid', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.removeProductFromCart);
//finalizar la compra
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), auth(['user', 'admin']), CartsController.finalizarCompra);

export default router;

// {
//     "message": "Perfil usuario",
//     "user": {
//         "id": "67a7ea10575cab6885ed1214",
//         "first_name": "Perfil",
//         "last_name": "Prueba",
//         "email": "gastonz1@admin.com",
//         "role": "admin",
//         "cart": "67a81c7971e7e91114e450a3"
//     }
// }