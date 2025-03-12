require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./Users"); //case sens

mongoose
  .comnnect(process.env.NOGODB_URI)
  .then(async () => {
    console.log("connected");

    //add user
    const newUser = new User({
      name: "bob",
      email: "blazar@gmail.com",
      password: "test123",
    });

    await newUser.save();
    console.log("user added");

    mongoose.connection.close();
  })
  .catch((err) => console.error("connection error", err));
