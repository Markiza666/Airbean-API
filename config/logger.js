// Installed Winston using: npm install winston

import winston from 'winston';  // Import Winston for logging

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Use less verbose logging in production, more in development
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json() // Use JSON format for easier parsing by log management tools
    ),
    transports: [
        new winston.transports.Console(), // Log to the console
    ],
});

export default logger;