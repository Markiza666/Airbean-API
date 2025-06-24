import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../config/logger.js';

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Log info/debug (not error) for missing token 
        logger.debug('Autentisering misslyckades: Ingen token angiven.');
        return res.status(401).json({ error: "Ingen autentisering stoken angiven." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Log 'warn' or 'error' depending on severity level
            // err.name and err.message for more details
            logger.warn(`Token verifiering misslyckades för IP: ${req.ip || 'okänd'} - Typ: ${err.name}, Meddelande: ${err.message}`);
            return res.status(403).json({ error: "Ogiltig eller utgången token." });
        }
        req.user = user;  // 'user' is the decoded payload from JWT
        next();
    });
};

export default authenticateToken;
