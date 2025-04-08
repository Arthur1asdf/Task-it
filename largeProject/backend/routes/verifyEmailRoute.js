const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const usersCollection = db.collection("User");

  // verify email
  router.post("/:token", async (req, res) => {
    try {
      const { token } = req.params;

      // find user with the token and check if token is still valid
      const user = await usersCollection.findOne({
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: Date.now() },
      });

      if (!user) return res.status(400).json({ error: "Invalid or expired token" });

      // mark email as verified
      await usersCollection.updateOne(
        { emailVerificationToken: token },
        { $set: { isEmailVerified: true }, $unset: { emailVerificationToken: "", emailVerificationExpiry: "" } }
      );

      res.json({success: true, message: "Email verification successful!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
