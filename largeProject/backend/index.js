const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt"); // import bcrypt for password hashing

const app = express();
app.use(cors());
app.use(bodyParser.json());

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    db = client.db("habbit");
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * @route   POST /api/register
 * @desc    Registers a new user
 */
app.post("/api/register", async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;

    // check if all fields are provided
    if (!Username || !Email || !Password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const usersCollection = db.collection("User");

    // check if user already exists
    const existingUser = await usersCollection.findOne({ $or: [{ Username }, { Email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or Email already exists" });
    }

    // hash the password before saving
    const saltRounds = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(Password, saltRounds);

    // create new user with hashed password
    const newUser = { Username, Email, Password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/login
 * @desc    Logs in a user
 */
app.post("/api/login", async (req, res) => {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ error: "Please enter username and password" });
    }

    const usersCollection = db.collection("User");

    // find user by username
    const user = await usersCollection.findOne({ Username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // compare hashed password with provided password
    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    //if (Password !== user.Password) {
    //return res.status(400).json({ error: 'Invalid username or password' });
    //}

    // generate jwt token
    const token = jwt.sign(
      { id: user._id, Username: user.Username, Email: user.Email }, // Payload
      JWT_SECRET, // Secret key
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token, Username: user.Username, Email: user.Email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TEST - hashing password
async function testHash() {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("mypassword123", saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

testHash();

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
