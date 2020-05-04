const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: String,
  lastName: String,
  email: {
    type: String,
    minlength: 3,
  },
});

userSchema.virtual("fullName").get(function () {
  return `${this.salutation} ${this.firstName} ${this.lastName}`;
});

userSchema.virtual("reverseName").get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const rounds = 10;
    this.password = await bcrypt.hash(this.password, rounds);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
