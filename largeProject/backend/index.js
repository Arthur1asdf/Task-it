const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path"); //set path for frontend and backend communication
const { MongoClient } = require("mongodb");
require("dotenv").config();
const path = require("path");

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
let db;

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db("habbit");
    console.log("Connected to MongoDB");

    // Mount routes AFTER db is ready
    const registerRoute = require("./routes/registerRoute")(db);
    const loginRoute = require("./routes/loginRoute")(db, JWT_SECRET);
    const taskRoute = require("./routes/taskRoute")(db);
    const forgotPasswordRoute = require("./routes/forgotPasswordRoute")(db);
    const resetPasswordRoute = require("./routes/resetPasswordRoute")(db);

    app.use("/api/register", registerRoute);
    app.use("/api/login", loginRoute);
    console.log("Mounted loginRoute");
    app.use("/api/taskRoute", taskRoute);
    app.use("/api/forgot-password", forgotPasswordRoute);
    app.use("/api/reset-password", resetPasswordRoute);

    // Serve frontend
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
      if (req.originalUrl.startsWith("/api")) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });

    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.error(" MongoDB connection error:", error));
