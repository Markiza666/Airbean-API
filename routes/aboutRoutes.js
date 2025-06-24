import express from 'express';
import getAboutInfo from '../controllers/aboutController.js';

const router = express.Router();

router.get('/about', getAboutInfo); // Define route

export default router;
