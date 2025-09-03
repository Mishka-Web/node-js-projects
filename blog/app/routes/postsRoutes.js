const express = require("express");
const router = express.Router();
const {
	getPosts,
	getPostID,
	createPost,
	updatePost,
	deletePost,
} = require("../controllers/postsController");

router.get("/posts", getPosts);
router.get("/posts/:id", getPostID);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

module.exports = router;
