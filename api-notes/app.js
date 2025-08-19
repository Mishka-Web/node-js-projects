const express = require("express");
const errorHanlder = require("./middleware/errorHandler");
const cors = require("cors");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");

require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/notes", require("./routes/notesRoutes"));

app.use(errorHanlder);

connectDB();

const PORT = process.env.PORT || "3000";
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
