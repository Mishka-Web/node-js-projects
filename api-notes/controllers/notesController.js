const { default: mongoose } = require("mongoose");
const Note = require("../models/Note");

const getNoteID = async (req, res) => {
  try {
    const noteId = req.params.id;
    const note = await Note.findById(noteId);

    res.json({ "status": "success", data: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNote = async (req, res) => {

  try {
    const { title, content } = req.body;

    if (!title || !content) res.status(400).json({ "message": "Параметры - title и content обязательны" });

    const isCreatedNote = await Note.create({ title, content });

    if (!isCreatedNote) res.status(404).json({ "message": "Ошибка создания заметки" });

    res.status(201).json({ "message": "Заметка успешно создана" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) res.status(400).json({ "message": "Неверный ID заметки" });

    const isUpdateNote = await Note.findByIdAndUpdate(id, { title: title, content: content });

    if (!isUpdateNote) json.status(404).json({ "message": "Заметка не найдена" });

    res.json({ "message": "Заметка успешно обновлена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) res.status(400).json({ "message": "Неверный ID заметки" });

    const isDeleteNote = await Note.findOneAndDelete(id);

    if (!isDeleteNote) json.status(404).json({ "message": "Заметка не найдена" });

    res.status(200).json({ "message": "Заметка успешно удалена" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getNotes = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 5;
    const startIndex = (currentPage - 1) * perPage;

    if (currentPage <= 0 || perPage <= 0) res.status(400).json({ "message": "Неверные параметры (page и limit должны быть > 0)" });

    const notes = await Note.find().skip(startIndex).limit(limit);

    if (!notes) res.status(400).json({ "message": "Данные не найдены" });

    const totalNotes = await Note.countDocuments();
    const totalPages = Math.ceil(totalNotes / limit);

    if (currentPage > totalPages) res.status(404).json({ "message": `Страница ${currentPage} не существует, всего страниц: ${totalPages}` });

    res.status(200).json({
      totalNotes,
      notes,
    })
  } catch (error) {
    res.status(500).json({ "message": error.message });
  }
};


module.exports = { getNotes, getNoteID, createNote, updateNote, deleteNote };
