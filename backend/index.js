const mongoose = require("mongoose");

require("dotenv").config();

const connectionString = process.env.MONGODB_URI;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error:", error));

const User = require("./models/user.model");
const Note = require("./models/note.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authentification, authentificateToken } = require("./utilities");
const userModel = require("./models/user.model");

app.use(express.json());

app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.json({ data: "Hello World!!" });
});

//Create Account
app.post("/creat-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(404).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(404)
      .json({ error: true, message: "Pasword id required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  const user = new User({ fullName, email, password });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Succesful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(404).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(404).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(404).json({ message: "User not found" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Succeful",
      email,
      accessToken,
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }
});

// Get User
app.get("/get-user", authentificateToken, async (req, res) => {
  const { user } = req.user; // Extraction de l'utilisateur authentifié

  try {
    // Recherche de l'utilisateur dans la base de données
    const isUser = await User.findOne({ _id: user._id });

    // Si l'utilisateur n'est pas trouvé, renvoyer une erreur 401
    if (!isUser) {
      return res.sendStatus(401);
    }

    // Retourner les informations de l'utilisateur
    return res.json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message: "User details retrieved successfully",
    });
  } catch (error) {
    // Gestion des erreurs serveur
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Add Note
app.post("/add-note", authentificateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!content) {
    return res
      .status(404)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });

    await note.save();

    return res.json({ error: false, note, message: "Note succesfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

//Edit Note
app.put("/edit-note/:noteId", authentificateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user.user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get All Notes
app.get("/get-all-notes", authentificateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authentificateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(484).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Update isPinned Value
app.put(
  "/update-note-pinned/:noteId",
  authentificateToken,
  async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
      const note = await Note.findOne({ _id: noteId, userId: user._id });
      if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }

      // Mise à jour du statut "isPinned"
      note.isPinned = isPinned;

      await note.save();

      return res.json({
        error: false,
        note,
        message: "Note updated successfully",
      });
    } catch (error) {
      // Gestion des erreurs internes
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server is running on port 8000");
});

module.exports = app;
