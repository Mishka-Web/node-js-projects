let notes = require("../models/notesModel");

const getNoteID = (req, res, next) => {
  let note = notes.find(el => el.id === +req.params.id);

  if (!note) {
    const err = new Error("Заметка не найдена");
    err.statusCode = 404;
    return next(err);
  }

  res.json({
    "status": "success",
    "data": note
  });
};

const createNote = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ "status": "error", message: "title и content обязательны" });
  }

  notes.push({
    id: notes.length + 1,
    title,
    content
  });

  res.status(201).json({ "status": "success", data: notes });
};

const updateNote = (req, res, next) => {
  let note = notes.find(el => el.id === +req.params.id);

  if (!note) {
    const err = new Error("Заметка не найдена");
    err.statusCode = 404;
    return next(err);
  }

  const { title, content } = req.body;

  if (title) note.title = title;
  if (content) note.content = content;

  res.json({ "status": "success", data: note });
}

const deleteNote = (req, res, next) => {
  let note = notes.find(el => el.id === +req.params.id);

  if (!note) {
    const err = new Error("Заметка не найдена");
    err.statusCode = 404;
    return next(err);
  }

  res.json({ "status": "success", data: notes.filter((el, i) => el.id !== +req.params.id) });
}

const getNotes = (req, res, next) => {
  const { page, limit } = req.query;

  const currentPage = parseInt(page, 10) || 1;
  const perPage = parseInt(limit, 10) || 5;

  if (currentPage <= 0 || perPage <= 0) {
    const err = new Error("Неверные параметры (page и limit должны быть > 0)");
    err.statusCode = 400;
    return next(err);
  }

  const countNotes = notes.length;
  const totalPages = Math.ceil(countNotes / perPage);

  if (currentPage > totalPages) {
    return res.status(404).json({
      status: "error",
      message: `Страница №${currentPage} не существует, всего страниц: ${totalPages}`,
    });
  }

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = currentPage * perPage;

  const data = notes.slice(startIndex, endIndex);

  res.json({
    status: "success",
    page: currentPage,
    limit: perPage,
    totalNotes: countNotes,
    totalPages,
    data,
  });
};


module.exports = { getNotes, getNoteID, createNote, updateNote, deleteNote };
