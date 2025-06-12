import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// Endpoint to get product-menu
router.get('/', productController.getProducts);

export default router;