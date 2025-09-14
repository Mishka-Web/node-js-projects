const express = require("express");
const router = express.Router();
const { getComments, createComment, updateComment, deleteComment } = require("../controllers/commentsController");

router.get("/comments/:id", getComments);
router.post("/comments", createComment);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

module.exports = router;
