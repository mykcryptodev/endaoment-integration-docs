import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import { checkLogin } from './routes/check-login.js';
import { initLogin } from './routes/init-login.js';
import { logout } from './routes/logout.js';
import { verifyLogin } from './routes/verify-login.js';
import { getDafs } from './routes/get-dafs.js';
import { getWireInstructions, wireDonation } from './routes/wire-donation.js';
import { getEnvOrThrow } from './utils/env.js';
import { createDaf } from './routes/create-daf.js';
import bodyParser from 'body-parser';
import { grant } from './routes/grant.js';
import { getDafActivity } from './routes/daf-activity.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Create a new express application instance
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Enable CORS for all routes
app.use(
  cors({
    origin: getEnvOrThrow('FRONTEND_URL'),
    credentials: true,
  })
);
// Enable parsing request bodies
app.use(bodyParser.json());
// Enable cookies
app.use(cookieParser());

// Set the network port
const port = process.env.PORT || 8080;

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API routes
app.get('/api/check-login', checkLogin);
app.get('/api/init-login', initLogin);
app.post('/api/logout', logout);
app.get('/api/verify-login', verifyLogin);
app.get('/api/get-dafs', getDafs);
app.post('/api/create-daf', createDaf);
app.post('/api/grant', grant);
app.get('/api/get-daf-activity', getDafActivity);
app.get('/api/wire-donation', getWireInstructions);
app.post('/api/wire-donation', wireDonation);

// Serve frontend for all other routes
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
