const express = require("express");
const router = express.Router();
const { ObjectId, ReturnDocument } = require("mongodb");

module.exports = (db) => {
  const User = db.collection("User");
  const Task = db.collection("User-Tasks");
  // Get Week Route: fetches tasks for the week based on a reference date
  router.get("/get-week", async (req, res) => {
    try {
      //this is a QUERY DO NOT USE BODY THIS IS HOW YOU TEST IN POSTMAN
      //  http://localhost:5000/api/taskRoute/get-week?date=2025-03-20
      // NO BODY REQUIRED
      // FRONT END
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

  // Add Task Route
  router.post("/add-task", async (req, res) => {
    try {
      //task dates must be an array even if it has only one date
      const { userId, taskName, taskDates } = req.body;

      // Validate input: userId, taskName, and taskDates (non-empty array) are required
      if (!userId || !taskName || !Array.isArray(taskDates) || taskDates.length === 0) {
        return res.status(400).json({ message: "All fields are required, including at least one date" });
      }

      const _id = new ObjectId(String(userId));
      const user = await User.findOne({ _id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate each date string by attempting to create a Date object.
      // Ensure that dates are valid ISO date strings.
      const validDates = taskDates.map((dateStr) => {
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj)) {
          throw new Error(`Invalid date format: ${dateStr}`);
        }
        return dateObj.toISOString().slice(0, 10);
      });

      const duplicateTask = await Task.findOne({
        userId,
        name: taskName,
        //$in looks through all the querys
        taskDates: { $in: validDates },
      });

      if (duplicateTask) {
        return res.status(400).json({ message: "Task with this name already exists on one or more of the selected dates" });
      }

      // Create new task document with the provided dates.
      // This creates a single task document that stores an array of dates.
      const newTask = {
        userId,
        name: taskName,
        taskDates: validDates, // Array of dates in "YYYY-MM-DD" format
        isCompleted: false,
        createdAt: new Date(),
      };

      await Task.insertOne(newTask);
      res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
      console.error("Error adding task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  //get tasks route here
  router.get("/get-tasks", async (req, res) => {
    try {
      // http://localhost:5000/api/taskRoute/get-tasks?userId=67bfe1d7601fd1ede10e5e71&taskDate=2025-03-25
      const { userId, taskDate } = req.query;
      if (!userId || !taskDate) {
        return res.status(400).json({ message: "User ID is required and Task date" });
      }

      const _id = new ObjectId(String(userId));
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      //.find returns cursor so we need to convert it to an array
      //tldr cursor looks ugly asf and not ez to work with, so array better
      const tasks = await Task.find({ userId, taskDates: { $in: [taskDate] } }).toArray();
      console.log(tasks);
      res.json({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // edit task route here
  router.put("/edit-task", async (req, res) => {
    try {
      const { userId, taskId, taskName } = req.body;

      if (!userId || !taskId || !taskName) {
        return res.status(400).json({ message: "User ID, task ID, and task name are required" });
      }

      const _id = new ObjectId(String(userId));
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      //userId is not objectId when stored in the database when we get it from a task
      const idForTask = new ObjectId(String(taskId));
      const updatedTask = await Task.findOneAndUpdate(
        { _id: idForTask },
        { $set: { name: taskName } },
        { returnOriginal: false } // comment is here becasuse prettier being a bitch
      );

      if (updatedTask._id.toString() !== taskId) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task updated successfully", task: updatedTask.value });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // task completion route here
  router.put("/complete-task", async (req, res) => {
    try {
      const { userId, taskId, isCompleted } = req.body;

      if (!userId || !taskId) {
        return res.status(400).json({ message: "User ID and task ID are required" });
      }

      const _id = new ObjectId(String(userId));
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      //userId is not objectId when stored in the database when we get it from a task
      const idForTask = new ObjectId(String(taskId));
      const updatedTask = await Task.findOneAndUpdate(
        { _id: idForTask },
        { $set: { isCompleted } },
        //also using returnDocument instead of returnOriginal because updated
        //task.isCompleted was returning the prev value instead of the updated value
        { returnDocument: "after" } //comment is here because of prettier
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (isCompleted) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get user's last activity
        const user = await User.findOne({ _id: new ObjectId(String(userId)) });
        const lastActivity = user.lastActivity ? new Date(user.lastActivity) : null;

        let newStreak;
        if (!lastActivity) {
          // No previous activity—start a new streak.
          newStreak = 1;
        } else {
          // Create a Date for yesterday.
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          // Check if lastActivity is exactly yesterday (ignoring time).
          if (lastActivity.getFullYear() === yesterday.getFullYear() && lastActivity.getMonth() === yesterday.getMonth() && lastActivity.getDate() === yesterday.getDate()) {
            // Continue the streak.
            newStreak = user.streak + 1;
          } else {
            // If the last activity is not yesterday, reset the streak.
            newStreak = 1;
          }
        }

        await User.updateOne({ _id: new ObjectId(String(userId)) }, { $set: { lastActivity: new Date(), streak: newStreak } });
        res.json({ message: "Task marked as completed", taskCompletion: updatedTask.isCompleted });
      }

      // removing not completed feature
      if (!isCompleted) {
        // // Then check if any tasks remain completed today for the user:
        // const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // const tomorrow = new Date(today);
        // tomorrow.setDate(tomorrow.getDate() + 1);

        // const remainingCompleted = await Task.find({
        //   userId,
        //   isCompleted: true,
        //   createdAt: { $gte: today, $lt: tomorrow }, // or another date field if you track completedAt
        // }).toArray();

        // if (remainingCompleted.length === 0) {
        //   // No tasks completed today—set lastActivity to yesterday (or clear it)
        //   const yesterday = new Date(today);
        //   yesterday.setDate(yesterday.getDate() - 1);
        //   await User.updateOne(
        //     { _id: new ObjectId(String(userId)) },
        //     { $set: { lastActivity: yesterday, streak: 0 } } // or adjust the streak as needed
        //   );
        // }
        res.json({ message: "Task marked as not completed", taskCompletion: updatedTask.isCompleted });
      }
    } catch (error) {
      console.error("Error completing task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  //task deletion route here
  router.delete("/delete-task", async (req, res) => {
    try {
      const { userId, taskId } = req.body;

      if (!userId || !taskId) {
        return res.status(400).json({ message: "User ID and task ID are required" });
      }

      const _id = new ObjectId(String(taskId));
      const deleteTask = await Task.deleteOne({ _id });
      if (deleteTask === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.get("/streaks", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const _id = new ObjectId(String(userId));
      const user = await User.findOne({ _id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ streak: user.streak || 0, lastActivity: user.lastActivity });
    } catch (error) {
      console.error("Error fetching streaks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  //search task route
  router.get("/search-tasks", async (req, res) => {
    try {
      //http://localhost:5000/api/taskRoute/search-tasks?userId=67bfe1d7601fd1ede10e5e71&query=buy&date=2025-03-25
      const { query, userId, date } = req.query;

      if (!query || !userId) {
        return res.status(400).json({ message: "Search is required or userId is incorrect" });
      }
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }

      // case sensitibve match
      const searchCriteria = {
        name: { $regex: query, $options: "i" },
      };
      //searching for stuff only in userId
      searchCriteria.userId = userId;
      searchCriteria.taskDates = { $in: [date] };

      const tasks = await Task.find(searchCriteria).toArray();

      res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error searching tasks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return router;
};
