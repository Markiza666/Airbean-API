import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';  
import logger from '../config/logger.js'; // Importerar logger

dotenv.config();

const authenticateToken = (req, res, next) => {  
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) { 
        // Här loggar vi info/debug, inte error, för en vanlig "saknad token"
        logger.debug('Autentisering misslyckades: Ingen token angiven.');
        return res.status(401).json({ error: "Ingen autentiseringstoken angiven." }); 
    } 

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { 
        if (err) { 
            // Här loggar vi som 'warn' eller 'error' beroende på allvarlighetsgrad
            // err.name och err.message ger mer detaljer
            logger.warn(`Token verifiering misslyckades för IP: ${req.ip || 'okänd'} - Typ: ${err.name}, Meddelande: ${err.message}`); 
            return res.status(403).json({ error: "Ogiltig eller utgången token." }); 
        } 
        req.user = user;  // 'user' här är den avkodade payloaden från JWT
        next(); 
    }); 
};

export default authenticateToken;
