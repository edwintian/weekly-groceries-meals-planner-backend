require("../utils/db");
const User = require("../models/user.model");

const findUser = (req, res, next) => {
  User.findOne({ username: req.user.name })
    .select("-__v -_id -password")
    .then(data => res.json(data))
    .catch(err => next(err));
};

const Joi = require("@hapi/joi");
const userRegistrationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .required(),
  password: Joi.string()
    .min(8)
    .required()
});

const { v4: uuidv4 } = require("uuid");
const validateAndCreateUser = (req, res, next) => {
  const result = userRegistrationSchema.validate(req.body);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
  } else {
    req.body.userId = uuidv4();
    User.create(req.body)
      .then(data => {
        let output = {};
        for (const key in data.toObject()) {
          if (key != "_id" && key != "__v" && key != "password") {
              output[key] = data[key];
          }
        }
        res.status(201).json(output);
      })
      .catch(err => next(err));
  }
};

const bcrypt = require("bcryptjs");
const { createJWTToken } = require("../utils/helper");
const validateLoginAndCreateJWTCookie = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      const err = new Error("Bad Request");
      err.statusCode = 400;
      throw err;
    }

    const token = createJWTToken(user.username, user.userId);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true // client-side js cannot access cookie info
      //secure: true, // use HTTPS
    });

    res.send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
};

const clearCookieAndDisplayLogoutMsg = (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
};

module.exports = {
  findUser,
  validateAndCreateUser,
  validateLoginAndCreateJWTCookie,
  clearCookieAndDisplayLogoutMsg
};
