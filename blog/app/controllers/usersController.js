const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, authenticateToken } = require("../functions");

const getUsers = async (req, res) => {
	try {
		const users = await prisma.user.findMany();
		res.json({ status: "success", data: users });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getUser = async (req, res) => {
	try {
		const userId = +req.params.id;
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		res.json({ status: "success", data: user });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const createUser = async (req, res) => {
	try {
		const { name, email, role, password: pass } = req.body;

		if (!name || !email || !role || !pass) {
			res.status(400).json({
				message: "Параметры - name, email, password обязательны",
			});
		}

		const hashPassword = async (pass, saltRounds = 10) => {
			try {
				const salt = await bcrypt.genSalt(saltRounds);
				return await bcrypt.hash(pass, salt);
			} catch (error) {
				console.log(error);
			}
		};

		const isExistUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (isExistUser) {
			res.status(400).json({ message: "Пользователь уже существует" });
		}

		const isCreatedUser = await prisma.user.create({
			data: {
				id: (await prisma.user.count()) + 1,
				name: name,
				email: email,
				role: role,
				password: await hashPassword(pass),
			},
		});

		if (!isCreatedUser) {
			res.status(404).json({ message: "Ошибка создания пользователя" });
		}

		res.status(201).json({ message: "Пользователь успешно создан" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUser = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id) res.status(400).json({ message: "Неверный ID пользователя" });

		const isUpdateUser = await prisma.user.update({
			where: {
				id: +id,
			},
			data: {
				...req.body,
			},
		});

		if (!isUpdateUser)
			json.status(404).json({ message: "Пользователь не найден" });

		res.json({ message: "Пользователь успешно обновлен" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const deleteUser = async (req, res) => {
	try {
		const id = req.params.id;

		const isDeleteUser = await prisma.user.delete({
			where: {
				id: +id,
			},
		});

		if (!isDeleteUser) {
			json.status(404).json({ message: "Пользователь не найден" });
		}

		res.status(200).json({ message: "Пользователь успешно удален" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Авторизация пользователя
const login = async (req, res) => {
	try {
		const { email, password: pass } = req.body;

		if (!email || !pass) {
			res.status(400).json({
				message: "Параметры - email, password обязательны",
			});
		}

		const isExistUser = await prisma.user.findUnique({
			where: {
				email: email,
			},
		});

		if (!isExistUser) {
			res.status(400).json({ message: "Пользователь не найден" });
		}

		if (isExistUser.password) {
			const isPasswordCorrect = await bcrypt.compare(
				pass,
				isExistUser.password
			);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Регистрация пользователя
const signup = async (req, res) => {
	try {
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Выход пользователя
const logout = async (req, res) => {
	try {
		const { name, email, role, password: pass } = req.body;

		if (!name || !email || !role || !pass) {
			res.status(400).json({
				message: "Параметры - name, email, password обязательны",
			});
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getUser,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	login,
	signup,
	logout,
};
