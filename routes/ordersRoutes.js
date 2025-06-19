import express from 'express';
import asyncHandler from 'express-async-handler';   // Import express-async-handler for handling async errors
import { createOrder, getOrderStatus, getOrderHistory } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 
import { validateNewOrder } from '../middleware/validationMiddleware.js'; 
import { validateMenuAndPrices } from '../middleware/menuValidationMiddleware.js'; 

const router = express.Router();

router.post('/orders', authenticateToken, validateNewOrder, validateMenuAndPrices, asyncHandler(createOrder));
router.get('/orders/:orderId/status', authenticateToken, asyncHandler(getOrderStatus));
router.get('/orders/history', authenticateToken,asyncHandler(getOrderHistory));

export default router; 
