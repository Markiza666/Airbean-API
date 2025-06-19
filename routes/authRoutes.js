import express from 'express';
import asyncHandler from 'express-async-handler';   // Importerar express-async-handler för att hantera asynkrona fel
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';  
import { validateLogin, validateRegistration } from './../middleware/validationMiddleware';


const router = express.Router();

router.post('/register', validateRegistration, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.get('/profile', authenticateToken, asyncHandler(getProfile));

export default router; 
