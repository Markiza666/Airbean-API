import express from 'express';
import asyncHandler from 'express-async-handler';   // Importerar express-async-handler för att hantera asynkrona fel
import validationMiddleware from './../middleware/validationMiddleware.js';
import { register, login } from '../controllers/authController.js'; // Importerar autentiseringsfunktioner
// Sammanställer valideringsmiddleware för inloggning och registrering
const { validateLogin, validateRegistration } = validationMiddleware;

const router = express.Router();

router.post('/register', validateRegistration, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));

export default router; 
