import express from 'express';
const router = express.Router();
import { register, login, getProfile } from '../controllers/authController.js';
import { validateRegistration, validateLogin } from '../middleware/validationMiddleware.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.get('/profile', authenticateToken, getProfile);

export default router;
