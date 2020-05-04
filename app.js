require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// parse req.body as a json object
app.use(express.json());

app.use(function (req, res, next) {
  // Debugger middleware
  // console.log('Cookies: ', req.cookies);
  // console.log('Signed Cookies: ', req.signedCookies);
  next();
})

app.get("", (req, res, next) => {
  res.send("Welcome to home");
});

const usersRouter = require("./routes/users.route");
app.use("/users", usersRouter);

app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500);
  res.send(`${err}`);
});

module.exports = app;
