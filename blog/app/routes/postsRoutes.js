const express = require("express");
const router = express.Router();
const {
	getPosts,
	getPostID,
	getPostSlug,
	createPost,
	updatePost,
	deletePost,
} = require("../controllers/postsController");

router.get("/posts", getPosts);
router.get("/posts/:id", getPostID);
router.get("/posts/:slug", getPostSlug);
router.post("/posts", createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

module.exports = router;
