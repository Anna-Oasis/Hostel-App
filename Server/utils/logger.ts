import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// Ensure logs directory exists
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const accessLogStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });

morgan.token('date', () => new Date().toISOString());
// Morgan middleware for HTTP request logging (logs to both file and console)
export const morganLogger = morgan(
    '[:date] [:method] :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message: string) => {
                process.stdout.write(message); //console
                accessLogStream.write(message); //file
            }
        }
    }
);

// Simple logger for other logs (logs to both file and console)
export const logger = {
    info: (message: string) => {
        const logMessage = `[${new Date().toISOString()}] [INFO] ${message}\n`;
        process.stdout.write(logMessage);
        fs.appendFileSync(LOG_FILE, logMessage);
    },
    error: (message: string) => {
        const logMessage = `[${new Date().toISOString()}] [ERROR] ${message}\n`;
        process.stderr.write(logMessage);
        fs.appendFileSync(LOG_FILE, logMessage);
    },
    config: (message: string) => {
        const logMessage = `[${new Date().toISOString()}] [CONFIG] ${message}\n`;
        process.stdout.write(logMessage);
        fs.appendFileSync(LOG_FILE, logMessage);
    }
};