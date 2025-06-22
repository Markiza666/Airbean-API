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
    ],
});

export default logger;