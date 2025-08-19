const {
	addTask,
	getListTasks,
	isDoneTask,
	deleteTask,
	editTask,
	getInfo,
	fileName,
} = require("./functions.js");

require('dotenv').config();

const typeCommand = process.argv[2];

switch (typeCommand) {
	case "add":
		let text = "";
		process.argv.forEach(function (x, i, arr) {
			if (![0, 1, 2].includes(i)) {
				text += `${x}${arr.length !== ++i ? ", " : ""}`;
			}
		});
		addTask(text);
		break;
	case "list":
		const filter = process.argv[3];
		switch (filter) {
			case "--done":
				getListTasks(fileName, "--done");
				break;
			case "--undone":
				getListTasks(fileName, "--undone");
				break;
			default:
				getListTasks(fileName);
				break;
		}
		break;
	case "done":
		isDoneTask(fileName, process.argv[3]);
		break;
	case "delete":
		deleteTask(fileName, process.argv[3]);
		break;
	case "edit":
		const numTask = process.argv[3];
		const newText = process.argv[4];
		editTask(fileName, numTask, newText);
		break;
	case "help":
		getInfo();
		break;
	default:
		console.log("Команда ToDo-лист - Не найдена!");
		break;
}
