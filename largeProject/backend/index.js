const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

//  middleware
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

    // Import and use routes
    const registerRoute = require("./routes/registerRoute")(db);
    const loginRoute = require("./routes/loginRoute")(db, JWT_SECRET);
    const taskRoute = require("./routes/taskRoute")(db);
    const forgotPasswordRoute = require("./routes/forgotPasswordRoute")(db);
    const resetPasswordRoute = require("./routes/resetPasswordRoute")(db);

    app.use("/api/register", registerRoute);
    app.use("/api/login", loginRoute);
    app.use("/api/taskRoute", taskRoute);
    app.use("/api/forgot-password", forgotPasswordRoute);
    app.use("/api/reset-password", resetPasswordRoute);
  })
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("This is the home");
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
