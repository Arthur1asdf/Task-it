const express = require("express");
const registerRoute = require("./routes/registerRoute");
const loginRoute = require("./routes/loginRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const resetPasswordRoute = require("./routes/resetPasswordRoute");
const taskRoute = require("./routes/taskRoute");
const verifyEmailRoute = require("./routes/verifyEmailRoute");

module.exports = (db, jwtSecret = "test-secret") => {
  const app = express();
  app.use(express.json());

  app.use("/api", registerRoute(db));
  app.use("/api", loginRoute(db, jwtSecret));
  app.use("/api", forgotPasswordRoute(db));
  app.use("/api", resetPasswordRoute(db));
  app.use("/api", verifyEmailRoute(db));
  app.use("/api/taskRoute", taskRoute(db));

  return app;
};
