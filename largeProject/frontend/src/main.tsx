import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/login";
import SignUp from "./pages/signup"; 


createRoot(document.getElementById("root")!).render(
  <StrictMode>
  <Login />
</StrictMode>
);
