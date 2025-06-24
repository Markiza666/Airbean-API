import express from 'express';
import asyncHandler from 'express-async-handler';   // Import express-async-handler for handling async errors
import { createOrder, getOrderStatus, getOrderHistory } from '../controllers/orderController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';
import validateMenuAndPrices from './../middleware/menuValidationMiddleware.js';

const router = express.Router();

router.post(
    '/orders',
    authenticateToken,  // Check if user is logged in
    validationMiddleware.validateNewOrder,   //  Ensures order has correct structure and data types
    validateMenuAndPrices,  // Checks that order items match menu items and prices
    asyncHandler(createOrder)   // Creates order if all validations pass


);
router.get(
    '/orders/:orderId/status',
    authenticateToken,
    asyncHandler(getOrderStatus)
);
router.get(
    '/orders/history',
    authenticateToken,
    asyncHandler(getOrderHistory)
);

export default router; 
