import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productsController.js';
import { auth } from '../middleware/auth.js';
import passport from 'passport';

const router = Router();

router.get('/', getProducts);
//crear
router.post('/', passport.authenticate('jwt', { session: false }), auth(['admin']), createProduct);
//actualizar
router.put('/:id', passport.authenticate('jwt', { session: false }), auth(['admin']), updateProduct);
//eliminar
router.delete('/:id', passport.authenticate('jwt', { session: false }), auth(['admin']), deleteProduct);


export default router;