import express from 'express';
import asyncHandler from 'express-async-handler';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'; // Import user profile functions only
import authenticateToken from '../middleware/authMiddleware.js'; // For authentication

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