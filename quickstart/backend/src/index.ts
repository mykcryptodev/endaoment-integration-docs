import cors from 'cors';
import express, { Request, Response } from 'express';
import { checkLogin } from './routes/check-login';
import { initLogin } from './routes/init-login';
import { logout } from './routes/logout';
import { verifyLogin } from './routes/verify-login';
import { getDafs } from './routes/get-dafs';
import { getWireInstructions, wireDonation } from './routes/wire-donation';

// Create a new express application instance
const app = express();

// Enable CORS for all routes
app.use(cors());

// Set the network port
const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Your backend service with Endaoment Integration!' });
});

// Auth routes
app.get('/check-login', checkLogin);
app.get('/init-login', initLogin);
app.post('/verify-login', verifyLogin);
app.post('/logout', logout);

// DAF routes
app.get('/get-dafs', getDafs);

// Donation routes
app.get('/wire-donation', getWireInstructions);
app.post('/wire-donation', wireDonation);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
