import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(__dirname, '../logs/app.log');


if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

const logToFile = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(LOG_FILE, logMessage);
};

export const logger = {
    info: (message: string) => {
        logToFile(`[INFO] ${message}`);
    },
    error: (message: string) => {
        logToFile(`[ERROR] ${message}`);
    },
    request: (method: string, url: string, status: number) => {
        logToFile(`[REQUEST] ${method} ${url} - Status: ${status}`);
    },
    db: (message: string) => {
        logToFile(`[DATABASE] ${message}`);
    }
}; 