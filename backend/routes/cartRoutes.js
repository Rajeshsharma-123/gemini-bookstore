const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Book = require("../models/bookModel");
const { jwtAuthMiddleware } = require("../jwt");

// ✅ Add book to cart
router.post("/cart", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // Prevent duplicates
    if (user.cartBooks.includes(bookId)) {
      return res.status(400).json({ error: "Book already in cart" });
    }

    user.cartBooks.push(bookId);
    await user.save();

    res.status(200).json({ message: "Book added to cart", cart: user.cartBooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add book to cart" });
  }
});

// ✅ Get current user's cart
router.get("/cart", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cartBooks");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ cart: user.cartBooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// ✅ Remove a book from cart
router.delete("/cart/:bookId", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cartBooks = user.cartBooks.filter((id) => id.toString() !== bookId);
    await user.save();

    res.status(200).json({ message: "Book removed from cart", cart: user.cartBooks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to remove book from cart" });
  }
});

// ✅ Clear entire cart
router.delete("/cart", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.cartBooks = [];
    await user.save();

    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
