import express from 'express';
import asyncHandler from 'express-async-handler';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'; // Importera endast user-funktioner
import authenticateToken from '../middleware/authMiddleware.js'; // För autentisering

const router = express.Router();

router.get(
    '/profile', 
    authenticateToken, 
    asyncHandler(getUserProfile)
);

router.patch(
    '/profile', 
    authenticateToken, 
    asyncHandler(updateUserProfile)
);

export default router;