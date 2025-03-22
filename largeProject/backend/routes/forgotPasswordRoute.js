//  send password reset link to user's email

const express = require("express");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

module.exports = (db) => {
    const usersCollection = db.collection("User");

    // forgot password
    router.post("/forgot-password", async (req, res) => {
        try {
            // get user email from request body
            const { Email } = req.body;
            const user = await usersCollection.findOne({ Email });

            // check if user exists
            if (!user) return res.status(404).json({ error: "User not found" });

            // generate reset token and expiry
            const resetToken = crypto.randomBytes(32).toString("hex");
            await usersCollection.updateOne({ Email }, { $set: { resetToken, resetTokenExpiry: Date.now() + 3600000 } });

            // send reset password email
            const resetLink = `http://146.190.218.123:5000/reset-password/${resetToken}`;
            await sendEmail(Email, "Password Reset", `Click here: ${resetLink}`);

            res.json({ message: "Check your email for the reset link." });
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