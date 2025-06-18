import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';    
dotenv.config();

export const authenticateToken = (req, res, next) => {  
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) { 
        return res.status(401).json({ error: "Ingen autentiseringstoken angiven." }); 
    } 

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { 
        if (err) { 
            console.error("Token verifiering misslyckades:", err.message); 
            return res.status(403).json({ error: "Ogiltig eller utgången token." }); 
        } 
        req.user = user; 
        next(); 
    }); 
};
