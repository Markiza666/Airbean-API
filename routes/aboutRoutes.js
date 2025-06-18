import express from 'express';
import { getAboutInfo } from '../controllers/aboutController.js';

const router = express.Router();

router.get('/', getAboutInfo);

export default router;
