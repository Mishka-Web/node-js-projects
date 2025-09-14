const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getComments = async (req, res) => {
	try {
		const id = +req.params.id;
		const comments = await prisma.comment.findMany({
			where: {
				postId: id,
			},
		});

		if (!comments) {
			res.status(404).json({ message: "Комментарии не найдены" });
		}

		res.json({ status: "success", data: comments });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateComment = async (req, res) => {
	try {
		const { text } = req.body;
		const id = req.params.id;

		if (!id) res.status(400).json({ message: "Неверный ID комментария" });

		const isUpdateComment = await prisma.comment.update({
			where: {
				id: +id,
			},
			data: {
				text: text,
			},
		});

		if (!isUpdateComment) json.status(404).json({ message: "Комментарий не найден" });

		res.json({ message: "Комментарий успешно обновлен" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteComment = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) res.status(400).json({ message: "Неверный ID комментария" });

		const isDeleteComment = await prisma.comment.delete({
			where: {
				id: +id,
			},
		});

		if (!isDeleteComment) json.status(404).json({ message: "Комментарий не найден" });

		res.status(200).json({ message: "Комментарий успешно удален" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createComment = async (req, res) => {
	try {
		const { text, postId, authorId } = req.body;

		if (!text || !postId || !authorId) {
			res.status(400).json({
				message: "Параметры - text, postId и authorId обязательны",
			});
		}

		const isCreatedComment = await prisma.comment.create({
			data: {
				id: (await prisma.comment.count()) + 1,
				text: text,
				postId: postId,
				authorId: authorId,
			},
		});

		if (!isCreatedComment) {
			res.status(404).json({ message: "Ошибка создания комментария" });
		}

		res.status(201).json({ message: "Комментарий успешно создан" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = { getComments, createComment, updateComment, deleteComment };
