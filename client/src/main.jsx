// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import { AuthProvider } from "./context/authContext";
import App from "./App";
import "./index.css"; // Tailwind

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  </React.StrictMode>
);
