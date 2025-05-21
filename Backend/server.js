import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/index.js";
import connectDB from "./Config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { swaggerOptions } from "./Config/swagger.js";

connectDB();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/api", router);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/*", (req, res) => {
  res.send(
    "👋 Welcome to Anna Oasis API!<br>See <a href='/api-docs'>/api-docs</a> for documentation."
  );
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

export default app;
