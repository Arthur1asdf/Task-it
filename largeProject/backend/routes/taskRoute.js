const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const User = db.collection("users");
  const Task = db.collection("tasks");

  // Get Week Route: fetches tasks for the week based on a reference date
  router.get("/get-week", async (req, res) => {
    try {
      //this is a QUERY DO NOT USE BODY THIS IS HOW YOU TEST IN POSTMAN
      //  http://localhost:5000/api/taskRoute/get-week?date=2025-03-20
      // NO BODY REQUIRED
      // FRONT END
      //  FUCK YOU CHATGPT IT
      const { date } = req.query; // e.g., "2025-03-20"
      if (!date) {
        return res.status(400).json({ message: "Reference date is required" });
      }

      const currentDate = new Date(date);
      const day = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      // Calculate start of week (Sunday) and normalize time to the start of day
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - day);
      startOfWeek.setHours(0, 0, 0, 0);

      // Calculate end of week (Saturday) and set time to the end of day
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // Query tasks that have a dueDate within this week
      const tasks = await Task.find({
        dueDate: { $gte: startOfWeek, $lte: endOfWeek },
      }).toArray();

      // Format dates to "YYYY-MM-DD" by slicing the ISO string
      const formattedStart = startOfWeek.toISOString().slice(0, 10);
      const formattedEnd = endOfWeek.toISOString().slice(0, 10);

      //startofweek is sunday and endofweek is saturday
      res.json({ startOfWeek: formattedStart, endOfWeek: formattedEnd, tasks });
    } catch (error) {
      console.error("Error fetching tasks for week:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

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
