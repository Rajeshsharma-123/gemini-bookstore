const express = require("express");
const app = express();
const db = require("./db"); // Import the database connection
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const cartRoutes = require("./routes/cartRoutes");


const bodyParser = require("body-parser");
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

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


app.listen(PORT, () => {
  console.log(`Server running on address http://localhost:${PORT}`);
});
