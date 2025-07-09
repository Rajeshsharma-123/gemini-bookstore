import axios from "axios";

const instance = axios.create({
  baseURL: "https://gemini-bookstore.onrender.com/api", // Replace with your backend URL if different
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
