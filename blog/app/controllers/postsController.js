const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getPostID = async (req, res) => {
	try {
		const postId = +req.params.id;
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});

		res.json({ status: "success", data: post });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getPostSlug = async (req, res) => {
	try {
		const postId = +req.params.id;
		const post = await prisma.post.findUnique({
			where: {
				id: postId,
			},
		});

		res.json({ status: "success", data: post });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getPosts = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const currentPage = parseInt(page, 10) || 1;
		const perPage = parseInt(limit, 10) || 5;
		const startIndex = (currentPage - 1) * perPage;

		if (currentPage <= 0 || perPage <= 0)
			res.status(400).json({
				message: "Неверные параметры (page и limit должны быть > 0)",
			});

		const posts = await prisma.post.findMany({
			skip: startIndex,
			take: perPage,
		});

		if (!posts) res.status(400).json({ message: "Данные не найдены" });

		const totalPosts = await prisma.post.count();
		const totalPages = Math.ceil(totalPosts / limit);

		if (currentPage > totalPages)
			res.status(404).json({
				message: `Страница ${currentPage} не существует, всего страниц: ${totalPages}`,
			});

		res.status(200).json({
			totalPosts,
			posts,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createPost = async (req, res) => {
	try {
		const { title, content, authorName, authorId } = req.body;

		if (!title || !content || !authorId || !authorName)
			res.status(400).json({
				message:
					"Параметры - title, authorName, authorId и content обязательны",
			});

		const isCreatedPost = await prisma.post.create({
			data: {
				title: title,
				content: content,
				authorName: authorName,
				authorId: authorId,
			},
		});

		if (!isCreatedPost)
			res.status(404).json({ message: "Ошибка создания постов" });

		res.status(201).json({ message: "Пост успешно создан" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updatePost = async (req, res) => {
	try {
		const { authorId, data } = req.body;
		const { id } = req.params;

		if (!id) res.status(400).json({ message: "Неверный ID поста" });

		const isUpdatePost = await prisma.post.update({
			where: {
				id: +id,
			},
			data: {
				title: data.title,
				content: data.content,
				authorName: data.authorName,
				authorId: +authorId,
			},
		});

		if (!isUpdatePost) json.status(404).json({ message: "Пост не найден" });

		res.json({ message: "Пост успешно обновлен" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deletePost = async (req, res) => {
	try {
		const { id } = req.params;

		if (!id) res.status(400).json({ message: "Неверный ID поста" });

		const isDeletePost = await prisma.post.delete({
			where: {
				id: +id,
			},
		});

		if (!isDeletePost) json.status(404).json({ message: "Пост не найден" });

		res.status(200).json({ message: "Пост успешно удален" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getPosts,
	getPostID,
	getPostSlug,
	createPost,
	updatePost,
	deletePost,
};
