const mongoose = require("mongoose");

// Define the Person schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
   
  },

  bookImage: {
    type: String,
    default: null,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
