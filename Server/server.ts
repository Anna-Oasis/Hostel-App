import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import routes from "./routes/index";
import { initDb } from "./config/dbConnection";
import { initCloudflare } from "./config/cloudflare";
import { morganLogger ,logger } from "./utils/logger";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morganLogger);

app.use("/", routes);
app.use(errorHandler); // last middleware for error handling

async function startServer() {
  try {
    await initDb()
    await initCloudflare();

    app.listen(port, () => {
      logger.config(`✅ Server is running on port ${port}...`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
  }
}

startServer();

export { app };
