const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/emailService");  // Import helper function
require('dotenv').config(); // Import environment variables

const router = express.Router();

module.exports = (db) => {
    router.post("/register", async (req, res) => {
        try {
            const { Username, Email, Password } = req.body;
            if (!Username || !Email || !Password) {
                return res.status(400).json({ error: "Please fill in all fields" });
            }

            const usersCollection = db.collection("User");
            const existingUser = await usersCollection.findOne({ $or: [{ Username }, { Email }] });
            if (existingUser) {
                return res.status(400).json({ error: "Username or Email already exists" });
            }

            const saltRounds = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(Password, saltRounds);
            const verificationToken = crypto.randomBytes(32).toString('hex');

            const newUser = { Username, Email, Password: hashedPassword, isVerified: false, verificationToken };
            await usersCollection.insertOne(newUser);

            const verificationLink = `http://146.190.218.123:5000/api/verify-email/${verificationToken}`;
            await sendEmail(Email, "Verify Your Email", `Click the following link to verify your email: ${verificationLink}`);

            res.status(201).json({ message: "User registered successfully. Check your email to verify your account." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
