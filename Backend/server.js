const express = require("express");
const dotenv = require("dotenv").config();
const reAdmissionRoutes = require("./routes/reAdmissionRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const connectDB = require("./Config/dbConnection");
const errorHandler = require("./middleware/errorHandler");

connectDB();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/admission", admissionRoutes);
app.use("/api/readmission", reAdmissionRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});