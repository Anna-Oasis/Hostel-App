import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/", authRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get(/^\/.*/, (req: Request, res: Response) => {
  res.send("👋 Welcome to Anna Oasis API!");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

export { app };