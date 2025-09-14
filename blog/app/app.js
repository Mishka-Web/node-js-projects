require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const express = require("express");
const cors = require("cors");
const { renderPage } = require("./functions");
const errorHanlder = require("./middleware/errorHandler");
const logger = require("./middleware/logger");
const sass = require("node-sass-middleware");
const axios = require("axios");

const PORT = process.env.PORT || "3000";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use(
	sass({
		src: path.join(__dirname, "scss"),
		dest: path.join(__dirname, "public/styles"),
		debug: true,
		outputStyle: "compressed",
		prefix: "/styles",
	})
);

app.use("/public", express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");

app.get("/", (req, res) => {
	renderPage(res, "index", { title: "Главная" });
});

app.use("/index", function (req, res) {
	res.redirect("/");
});

app.get("/blog", async (req, res) => {
    try {
        const apiResponse = await axios.get(`http://localhost:${PORT}/api/posts`); 
        
        const data = apiResponse.data.posts;

        renderPage(res, "blog", {
            title: "Список постов",
            posts: data,
        });
    } catch (error) {
        console.error("Ошибка при получении данных из API:", error);
        renderPage(res, "blog", {
            title: "Блог",
            posts: [],
            error: "Не удалось загрузить посты. Попробуйте позже."
        });
    }
});

app.use("/api", require("./routes/postsRoutes"));
app.use("/api", require("./routes/usersRoutes"));
app.use("/api", require("./routes/commentsRoutes"));

app.use(errorHanlder);

(async () => {
	try {
		app.listen(PORT, () => {
			console.log(`Сервер запущен на порту ${PORT}`);
		});
	} catch (error) {
		console.error("Ошибка запуска сервера:", error.message);
		process.exit(1);
	}
})();

process.on("beforeExit", async () => {
	console.log("Закрытие соединения с базой данных...");
	await prisma.$disconnect();
	console.log("Соединение закрыто.");
});
