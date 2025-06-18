import express from 'express';
import { createOrder, getOrderStatus, getOrderHistory } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 
import { validateNewOrder } from '../middleware/validationMiddleware.js'; 
import { validateMenuAndPrices } from '../middleware/menuValidationMiddleware.js'; 

const router = express.Router();

router.post('/orders', authenticateToken, validateNewOrder, validateMenuAndPrices, createOrder);
router.get('/orders/:orderId/status', authenticateToken, getOrderStatus);
router.get('/orders/history', authenticateToken, getOrderHistory);

export default router; 
