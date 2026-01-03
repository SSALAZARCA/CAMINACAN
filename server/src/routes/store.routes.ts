import { Router } from 'express';
import { getProducts, createProduct, createOrder, getMyOrders, getWishlist, toggleWishlist } from '../controllers/store.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/products', getProducts); // Public

router.use(authenticate);

import { validate } from '../middleware/validate.middleware';
import { productSchema, orderSchema } from '../utils/schemas';

router.post('/products', validate(productSchema), createProduct); // Admin check inside controller or middleware
router.post('/orders', validate(orderSchema), createOrder);
router.get('/orders', getMyOrders);

router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);

export default router;
