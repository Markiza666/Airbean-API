import express from 'express';
import orderController from '../controllers/orderController.js';
import { validateMenuAndPrices } from '../middleware/menuValidationMiddleware.js';
import { validateNewOrder } from '../middleware/validationMiddleware.js';

router.get('/orders/:orderId/status/history', authenticateToken, getOrderStatus);

const router = express.Router();

router.post('/', orderController.createOrder, validateMenuAndPrices, validateNewOrder);

export default router;