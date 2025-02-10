import { Router } from 'express';
import { ProductsController } from '../controllers/productsController.js';
import { auth } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();



//obtener
router.get('/', ProductsController.getProducts);
//crear
router.post('/', passport.authenticate('jwt', { session: false }), auth(['admin']), ProductsController.createProduct);
//actualizar
router.put('/:id', passport.authenticate('jwt', { session: false }), auth(['admin']), ProductsController.updateProduct);
//eliminar
router.delete('/:id', passport.authenticate('jwt', { session: false }), auth(['admin']), ProductsController.deleteProduct);


export default router;

