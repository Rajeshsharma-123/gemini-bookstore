const express = require("express");
const app = express();
const db = require("./db"); // Import the database connection
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");


const bodyParser = require("body-parser");
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true, // if you're using cookies/auth tokens
}));

// app.use('/' , (req , res) => {
//   res.send("<h1>Welcome to the Online Book Store API <h1/>");
// })
app.use('/uploads', express.static('uploads'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/bookRoutes'));
app.use('/api', require('./routes/cartRoutes'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT);
