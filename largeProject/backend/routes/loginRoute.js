const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

module.exports = (db, JWT_SECRET) => {
  router.post("/", async (req, res) => {
    try {
      const { Username, Password } = req.body;

      //  check for empty fields
      if (!Username || !Password) {
        return res.status(400).json({ error: "Please enter username and password" });
      }

      //  use User database
      const usersCollection = db.collection("User");

      //  check if username exists
      const user = await usersCollection.findOne({ Username });
      if (!user) {
        return res.status(400).json({ error: "Invalid username or password" });
      }

      //  check if user's email has been verified
      // const isVerified = user.isEmailVerified;
      // if (!isVerified){
      //   return res.status(400).json({ error: "Verify your email before signing in"});
      // }

      //  check if password for user matches inputted password
      const isMatch = await bcrypt.compare(Password, user.Password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
      }

      //  generate a JWT token with user ID, username, and email, valid for 1 hour
      const token = jwt.sign({ id: user._id, Username: user.Username, Email: user.Email }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ message: "Login successful", token, userId: user._id, Username: user.Username, Email: user.Email });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
