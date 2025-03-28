import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes/index.js";
import connectDB from "./config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";

connectDB();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
