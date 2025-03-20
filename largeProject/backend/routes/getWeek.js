const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  const Task = db.collection("tasks");
  console.log("getWeek.js loaded");
  // Get Week Route: fetches tasks for the week based on a reference date
  router.get("/get-week", async (req, res) => {
    try {
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

      res.json({ startOfWeek, endOfWeek, tasks });
    } catch (error) {
      console.error("Error fetching tasks for week:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Existing routes (e.g., complete-task) can follow here...

  return router;
};
