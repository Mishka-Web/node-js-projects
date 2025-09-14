const express = require("express");
const router = express.Router();
const {
	getUser,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	login,
	signup,
	logout,
} = require("../controllers/usersController");

router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/api/login", login);
router.post("/api/signup", signup);
router.post("/api/logout", logout);

module.exports = router;
