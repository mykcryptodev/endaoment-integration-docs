import cors from "cors";
import express, { Request, Response } from "express";
import { checkLogin } from "./routes/check-login";
import { initLogin } from "./routes/init-login";
import { logout } from "./routes/logout";
import { verifyLogin } from "./routes/verify-login";

// Create a new express application instance
const app = express();

// Enable CORS for all routes
app.use(cors());

// Set the network port
const port = process.env.PORT || 3001;

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Your backend service with Endaoment Integration!" });
});

app.get("/check-login", checkLogin);
app.get("/init-login", initLogin);
app.post("/verify-login", verifyLogin);
app.post("/logout", logout);

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
