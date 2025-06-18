import express from 'express';
import productController from '../controllers/productController.js';
import { getMenu } from '../controllers/productController.js';



const router = express.Router();

router.get('/', productController.getProducts,'/menu', getMenu);


export default router;