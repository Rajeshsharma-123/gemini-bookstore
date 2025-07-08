const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");
const { jwtAuthMiddleware } = require("../jwt");
const multer = require("multer");
const path = require("path");
const User = require("../models/userModel");
const { generateText } = require("../gemini");

// Multer setup for book image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "")}`),
});
const upload = multer({ storage });

//  Middleware to check admin
function adminOnly(req, res, next) {

  console.log("Checking admin access for user:", req.user);
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).json({ error: "Admin access only" });
  }
}

// Add a new book (admin only)
router.post(
  "/books",
  jwtAuthMiddleware,
  adminOnly,
  upload.single("bookImage"),
  async (req, res) => {
    try {
      const bookData = req.body;
      if (req.file) {
        bookData.bookImage = `uploads/${req.file.filename}`;
      }

      const newBook = new Book(bookData);
      const savedBook = await newBook.save();
      res.status(201).json({ message: "Book added", book: savedBook });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add book" });
    }
  }
);

//  Get all books (public)
router.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json({ books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching books" });
  }
});

// Get a single book by ID
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching book" });
  }
});

// Update a book (admin only)
router.put(
  "/books/:id",
  jwtAuthMiddleware,
  adminOnly,
  upload.single("bookImage"),
  async (req, res) => {
    try {
      const updatedData = req.body;
      if (req.file) {
        updatedData.bookImage = `uploads/${req.file.filename}`;
      }

      const updatedBook = await Book.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      if (!updatedBook)
        return res.status(404).json({ error: "Book not found" });

      res.status(200).json({ message: "Book updated", book: updatedBook });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating book" });
    }
  }
);

//  Delete a book (admin only)
router.delete("/books/:id", jwtAuthMiddleware, adminOnly, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });

    res.status(200).json({ message: "Book deleted", book: deletedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting book" });
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const books = await Book.find({
      title: { $regex: q, $options: "i" }, // Case-insensitive search
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error searching book", error });
  }
})

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;
  try {
    const answer = await generateText(prompt);
    res.json({ response: answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error" });
  }
});



module.exports = router;
