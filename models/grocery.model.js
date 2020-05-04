const mongoose = require("mongoose");

const groceriesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  itemName: {
    type: String,
    minlength: 3,
    required: true
  },
  quantity: {
    type: Number,
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
