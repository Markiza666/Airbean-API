import express from 'express';
import asyncHandler from 'express-async-handler';   // Imports express-async-handler to handle async errors
import validationMiddleware from './../middleware/validationMiddleware.js';
import { register, login } from '../controllers/authController.js'; // Import authentication functions

// Combines validation middleware for login and registration processes
const { validateLogin, validateRegistration } = validationMiddleware;

const router = express.Router();

router.post('/register', validateRegistration, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));

export default router; 
