// Installerade winston: npm install winston
import winston from 'winston';  // Importerar winston för loggning

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Logga mindre i prod, mer i dev
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // JSON-format för enklare parsing av loggverktyg
    ),
    transports: [
        new winston.transports.Console(), // Logga till konsolen
        // I produktion kanske du vill logga till en fil eller en extern tjänst:
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'combined.log' }),
    ],
});

export default logger;