// reset the user's password using link sent to email

const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = (db) => {
    const usersCollection = db.collection("User");

    // reset password
    router.post("/reset-password/:token", async (req, res) => {
        try {
            // get token and new password from request
            const { token } = req.params;
            const { newPassword } = req.body;

            // find user with the token and check if token is still valid
            const user = await usersCollection.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

            // if user not found or token expired, return error
            if (!user) return res.status(400).json({ error: "Invalid or expired token" });

            // hash the new password and add it to the database
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await usersCollection.updateOne({ resetToken: token }, { $set: { Password: hashedPassword }, $unset: { resetToken: "", resetTokenExpiry: "" } });

            res.json({ message: "Password reset successful!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
