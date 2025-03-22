const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer'); // for email verification
const crypto = require("crypto");

const router = express.Router();

module.exports = (db) => {
    // Email setup for verification
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS  
        }
    });

    router.post("/register", async (req, res) => {
        try {
            const { Username, Email, Password } = req.body;
            
            //  check for empty fields
            if (!Username || !Email || !Password) {
            return res.status(400).json({ error: "Please fill in all fields" });
            }

            //  use User database
            const usersCollection = db.collection("User");

            //  check if user already exists
            const existingUser = await usersCollection.findOne({ $or: [{ Username }, { Email }] });
            if (existingUser) {
            return res.status(400).json({ error: "Username or Email already exists" });
            }

            //  generate hashed password
            const saltRounds = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(Password, saltRounds);

            //  generate verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');

            //  create new user and add to database
            const newUser = { Username, Email, Password: hashedPassword, isVerified: false, verificationToken };
            await usersCollection.insertOne(newUser);

            //  send verification email
            const verificationLink = `http://146.190.218.123:5000/api/verify-email/${verificationToken}`;
            await sendEmail(Email, "Verify Your Email", `Click the following link to verify your email: ${verificationLink}`);
            
            res.status(201).json({ message: "User registered successfully. Check email to verify your account." });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/verify-email/:token', async (req, res) => {
        try {
            const { token } = req.params;
            const usersCollection = db.collection("User");
    
            const user = await usersCollection.findOne({ verificationToken: token });
            if (!user) return res.status(400).json({ error: 'Invalid or expired token' });
    
            user.isVerified = true;
            user.verificationToken = null;

            // Update user verification status
            await usersCollection.updateOne(
                { verificationToken: token },
                { $set: { isVerified: true }, $unset: { verificationToken: "" } }
            );

            res.json({ message: 'Email verified successfully! You can now log in.' });
    
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};

// helper function to send emails
async function sendEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}