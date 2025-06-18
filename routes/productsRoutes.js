import express from 'express'; 
const router = express.Router(); 
import { getMenu } from '../controllers/productController.js'; // Named import 

router.get('/menu', getMenu); 

export default router; // 
