const fs = require("fs");
const clc = require("cli-color");

const fileName = "data.json";
const log = console.log;

function addTask(text) {
	if (text !== "") {
		fs.readFile(fileName, "utf8", (err, data) => {
			if (err) throw err;

			let res = JSON.parse(data);

			res.push({ id: res.length + 1, text: text, status: "undone" });

			log(
				`\x1b[32m Задача №${res.length}: '${text}' - Добавлена! \x1b[0m`
			);

			fs.writeFile(fileName, JSON.stringify(res, null, 2), (err) => {
				if (err) throw err;
			});
		});
	} else {
		log(`\x1b[43m Вы не ввели текст задачи! \x1b[0m`);
	}
}

function getListTasks(fileName, filter = "all") {
	fs.stat(fileName, (err, stats) => {
		if (err && err.code === "ENOENT") {
			fs.writeFile(fileName, "[]", (err) => {
				if (err) throw err;
				log("Создан файл:", fileName);
			});
		} else if (err) {
			console.error("Ошибка:", err);
		} else if (stats.isFile()) {
			fs.readFile(fileName, "utf8", (err, data) => {
				if (err) throw err;
				const res = JSON.parse(data);
				if (filter === "all") {
					log(res);
				} else {
					switch (filter) {
						case "--done":
							log(res.filter((el) => el.status === "done"));
							break;
						case "--undone":
							log(res.filter((el) => el.status === "undone"));
							break;
					}
				}
			});
		}
	});
}

function isDoneTask(fileName, taskIndex) {
	fs.readFile(fileName, "utf8", (err, data) => {
		if (err) throw err;

		let res = JSON.parse(data);
		let found = false;

		for (let i = 0; i < res.length; i++) {
			if (res[i].id === +taskIndex) {
				res[i].status = "done";
				log(`\x1b[42m Задача №${res[i].id} - Выполнена. \x1b[0m`);
				found = true;
				break;
			}
		}

		if (!found) {
			log(clc.red(`Задача №${taskIndex} - Не найдена!`));
		}

		fs.writeFile(fileName, JSON.stringify(res, null, 2), (err) => {
			if (err) throw err;
		});
	});
}

function editTask(fileName, taskIndex, taskText) {
	fs.readFile(fileName, "utf8", (err, data) => {
		if (err) throw err;

		let res = JSON.parse(data);

		for (let i = 0; i < res.length; i++) {
			if (res[i].id === +taskIndex) {
				res[i].text = taskText;
				log(`\x1b[42m Задача №${res[i].id} - Изменена. \x1b[0m`);
				break;
			}
		}

		fs.writeFile(fileName, JSON.stringify(res, null, 2), (err) => {
			if (err) throw err;
		});
	});
}

function deleteTask(fileName, taskIndex) {
	fs.readFile(fileName, "utf8", (err, data) => {
		if (err) throw err;

		let res = JSON.parse(data);

		let resClear = res.filter((el) => el.id !== +taskIndex);

		fs.writeFile(fileName, JSON.stringify(resClear, null, 2), (err) => {
			if (err) throw err;
		});
	});
}

function getInfo() {
	log("\nДобавление задачи - 'add' <название задачи>");
	log("Список задач - 'list'");
	log("Пометить задачу выполненной - 'done' <номер задачи>");
	log("Удаление задачи - 'delete' <номер задачи>");
}

module.exports = {
	addTask,
	getListTasks,
	deleteTask,
	isDoneTask,
	editTask,
	getInfo,
	fileName,
};
