import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import routes from "./routes/index";
import authRoutes from "./routes/authRoutes";
import { initDb } from "./config/dbConnection";
import { logger } from "./utils/logger";
import http from "http";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/api", routes);
app.use("/", authRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const local = res.send;
    res.send = function (body) {
        logger.request(req.method, req.url, res.statusCode);
        return local.call(this, body);
    };
    next();
});



app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});

app.get(/^\/.*/, (req: Request, res: Response) => {
    res.send("👋 Welcome to Anna Oasis API!");
});

app.use(errorHandler);

let server: http.Server;

initDb().then(() => {
    server = app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
});

   

export { app };
