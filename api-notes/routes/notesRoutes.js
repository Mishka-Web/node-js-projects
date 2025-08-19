const express = require("express");
const router = express.Router();
const { getNotes, getNoteID, createNote, updateNote, deleteNote } = require("../controllers/notesController");

router.get("/notes", getNotes);
router.get("/notes/:id", getNoteID);
router.post("/notes", createNote);
router.put("/notes/:id", updateNote);
router.delete("/notes/:id", deleteNote);

module.exports = router;
