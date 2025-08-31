require("dotenv").config();

const express = require("express");
const errorHanlder = require("./middleware/errorHandler");
const cors = require("cors");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const PORT = process.env.PORT || "3000";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api", require("./routes/notesRoutes"));

app.use(errorHanlder);

(async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  } catch (error) {
    console.error("Ошибка запуска сервера:", error.message);
    process.exit(1);
  }
})();
