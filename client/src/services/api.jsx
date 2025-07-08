import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your backend URL if different
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
