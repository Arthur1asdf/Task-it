import { StrictMode } from "react";
// import React from "react"; uncomment if needed
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import Forgetpassword from "./pages/forgetpassword";
import Forgetusername from "./pages/forgetusername";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Login />} /> {/* Default Route */}
        <Route path="/forgetpassword" element={<Forgetpassword />} />
        <Route path="/forgetusername" element={<Forgetusername />} />
      </Routes>
    </Router>
  </StrictMode>
);
