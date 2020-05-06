const mongoose = require("mongoose");

const groceriesSchema = new mongoose.Schema({
  userIdWithItemName: {
    type: String,
    minlength: 3,
    unique: true,
    required: true,
  },
  quantity: {
    type: Number,
    min: 0,
    required: true
  },
  unit: {
    type: String,
    minlength: 1,
    required: true
  },
});

const Grocery = mongoose.model("Grocery", groceriesSchema);
module.exports = Grocery;
