const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  const User = db.collection("users");
  const Task = db.collection("tasks");
  //do not uncomment yet I need to create the date stuff first
  //   // Add Task Route
  //   router.post("/add-task", async (req, res) => {
  //     try {
  //       const { userId, taskName, taskDescription } = req.body;

  //       // Validate input
  //       if (!userId || !taskName || !taskDescription) {
  //         return res.status(400).json({ message: "All fields are required" });
  //       }

  //       // Check if user exists
  //       const user = await User.findOne({ _id: userId });
  //       if (!user) {
  //         return res.status(404).json({ message: "User not found" });
  //       }

  //       // Create new task
  //       const newTask = {
  //         userId,
  //         name: taskName,
  //         description: taskDescription,
  //         completed: false,
  //         createdAt: new Date(),
  //       };

  //       await Task.insertOne(newTask);
  //       res.status(201).json({ message: "Task added successfully", task: newTask });
  //     } catch (error) {
  //       console.error("Error adding task:", error);
  //       res.status(500).json({ message: "Internal Server Error" });
  //     }
  //   });
  // Complete Task Route
  router.post("/complete-task", async (req, res) => {
    try {
      const { userId, taskId } = req.body;

      const user = await User.findOne({ _id: userId });
      const task = await Task.findOne({ _id: taskId });

      if (!user || !task) {
        return res.status(404).json({ message: "Task or user not found" });
      }

      const today = new Date();
      const lastActivity = user.lastActivity ? new Date(user.lastActivity) : null;

      let globalStreak = user.globalStreak || 0;

      if (lastActivity) {
        const diff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

        if (diff === 1) {
          // Streak continues
          globalStreak += 1;
        } else if (diff > 1) {
          // Streak resets
          globalStreak = 1;
        }
      } else {
        // First-time completion
        globalStreak = 1;
      }

      // Update the user document
      await User.updateOne({ _id: userId }, { $set: { globalStreak, lastActivity: today } });

      res.json({ success: true, globalStreak });
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};
