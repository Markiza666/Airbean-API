import express from 'express';
import asyncHandler from 'express-async-handler';   // Importerar express-async-handler för att hantera asynkrona fel
import authenticateToken from '../middleware/authMiddleware.js';  
import validationMiddleware from './../middleware/validationMiddleware.js';
import authController from '../controllers/authController.js';
// Importerar autentiseringskontroller för att hantera registrering, inloggning och profilhämtning
const { register, login, getProfile } = authController;
// Sammanställer valideringsmiddleware för inloggning och registrering
const { validateLogin, validateRegistration } = validationMiddleware;

const router = express.Router();

router.post('/register', validateRegistration, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.get('/profile', authenticateToken, asyncHandler(getProfile));

export default router; 
