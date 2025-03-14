const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = (db) => {
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

        //  create new user and add to database
        const newUser = { Username, Email, Password: hashedPassword };
        await usersCollection.insertOne(newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

    return router;
};
