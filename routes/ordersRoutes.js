import express from 'express';
import orderController from '../controllers/orderController.js';
import { validateMenuAndPrices } from '../middleware/menuValidationMiddleware.js';
import { validateNewOrder } from '../middleware/validationMiddleware.js';
import { createOrder, getOrderStatus, getOrderHistory } from '../controllers/;orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

router.get('/orders/:orderId/status/', authenticateToken, getOrderStatus);

const router = express.Router();

router.post('/orders', authenticateToken, validateNewOrder, validateMenuAndPrices, createOrder);
router.get('/orders/:orderId/status', authenticateToken, getOrderStatus);
router.get('/orders/history', authenticateToken, getOrderHistory);


export default router;