import express from 'express';  
import asyncHandler from 'express-async-handler'; // Import express-async-handler for handling async errors
import { getMenu } from '../controllers/productController.js'; 

const router = express.Router(); 

router.get('/menu', asyncHandler(getMenu)); 

export default router; 
