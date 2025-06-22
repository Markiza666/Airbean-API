import express from 'express';
import getAboutInfo from '../controllers/aboutController.js';

const router = express.Router();

router.get('/about', getAboutInfo); // Routen är definierad

export default router;
