const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "log.txt");

const logger = (req, res, next) => {
	const start = Date.now();

	res.on("finish", () => {
		const duration = Date.now() - start;
		const logMessage = `[${new Date().toLocaleString()}] ${req.method} ${
			req.url
		} ${res.statusCode} - ${duration}ms\n`;

		fs.appendFile(logFile, logMessage, (err) => {
			if (err) console.error("Ошибка записи лога:", err);
		});

		console.log(logMessage.trim());
	});

	next();
};

module.exports = logger;
