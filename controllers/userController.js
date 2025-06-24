import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import logger from '../config/logger.js';

// Get User Profile
// GET /api/profile
// Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user.userId from authMiddleware
    const user = await User.findById(req.user.userId).select('-password -__v'); // Excludes password and __v

    if (!user) {
        logger.error(`Kunde inte hitta användarprofil för ID: ${req.user.userId}. Token kan vara föråldrad/felaktig.`);
        return res.status(404).json({ message: 'Användaren hittades inte.' });
    }

    res.status(200).json({
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
});

// Update User Profile
// PATCH /api/profile
// Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user.userId; // Users MongoDB _id from JWT payload
    const { currentPassword, newPassword, username } = req.body;

    const user = await User.findById(userId);

    if (!user) {
        logger.error(`Försök att uppdatera profil för okänd användare med ID: ${userId}`);
        return res.status(404).json({ message: 'Användaren hittades inte.' });
    }

    // Change password
    if (newPassword) {
        if (!currentPassword) {
            return res.status(400).json({ message: 'Nuvarande lösenord krävs för att byta lösenord.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            logger.warn(`Misslyckat lösenordsbyte för användare ${user.username} (ID: ${userId}): Felaktigt nuvarande lösenord.`);
            return res.status(401).json({ message: 'Felaktigt nuvarande lösenord.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Nya lösenordet måste vara minst 6 tecken.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        logger.info(`Lösenord uppdaterat för användare: ${user.username} (ID: ${userId})`);
    }

    // Update username
    if (username && user.username !== username) {
        const userExists = await User.findOne({ username });
        if (userExists && userExists._id.toString() !== userId.toString()) {
            logger.warn(`Försök att uppdatera till redan taget användarnamn: ${username} av användare ${user.username} (ID: ${userId})`);
            return res.status(400).json({ message: 'Användarnamnet är redan upptaget.' });
        }
        user.username = username;
        logger.info(`Användarnamn uppdaterat för användare ${userId} till: ${username}`);
    }

    await user.save();

    res.status(200).json({
        message: 'Profil uppdaterad framgångsrikt!',
        user: {
            _id: user._id,
            username: user.username,
        }
    });
});

export { getUserProfile, updateUserProfile }; // Export only profile functions