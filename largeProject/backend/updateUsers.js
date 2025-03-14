/*
 * Run this script to update existing users
 * add streaks to their account
*/

const mongoose = require("mongoose");
const User = require("./Users"); // TODO - move Users.js to a folder called models

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function updateUsers() {
  await User.updateMany({}, { 
    $set: { globalStreak: 0, lastActivity: null }
  });
  console.log("Users updated successfully!");
  mongoose.disconnect();
}

updateUsers();
