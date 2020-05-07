require("../utils/db");
const Grocery = require("../models/grocery.model");
const Joi = require("@hapi/joi");
const grocerySchema = Joi.object({
  itemName: Joi.string()
    .min(3)
    .required(),
  quantity: Joi.number()
    .min(0)
    .required(),
  unit: Joi.string()
    .min(1)
    .required()
});

const createGroceries = (req, res, next) => {
  const postContent = req.body;
  const result = grocerySchema.validate(postContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    const concatenatedUserWithItem = req.user.id + "_" + postContent.itemName;
    Grocery.create({
      userIdWithItemName: concatenatedUserWithItem,
      name: postContent.itemName,
      quantity: postContent.quantity,
      unit: postContent.unit
    })
      .then(data => {
        let output = {};
        for (const key in data.toObject()) {
          if (key != "_id" && key != "__v") {
            output[key] = data[key];
          }
          if (key === "userIdWithItemName") {
            output[key] = data[key].split("_")[1];
          }
        }
        res.status(201).json(output);
      })
      .catch(err => next(err));
  }
};

const findAndUpdateGroceries = (req, res, next) => {
  const putContent = req.body;
  const result = grocerySchema.validate(putContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    const concatenatedUserWithItem = req.user.id + "_" + putContent.itemName;
    Grocery.findOneAndUpdate(
      { userIdWithItemName: concatenatedUserWithItem },
      {
        quantity: putContent.quantity,
        unit: putContent.unit
      },
      { new: true }
    )
      .then(data => {
        let output = {};
        for (const key in data.toObject()) {
          if (key != "_id" && key != "__v") {
            output[key] = data[key];
          }
          if (key === "userIdWithItemName") {
            output[key] = data[key].split("_")[1];
          }
        }
        res.status(201).json(output);
      })
      .catch(err => next(err));
  }
};

const getGroceries = (req, res, next) => {
  const filterByUserId = async userIdWithItemName => {
    const regex = new RegExp(userIdWithItemName, "gi");
    const filteredResults = await Grocery.find({
      userIdWithItemName: regex
    }).select("-__v -_id");
    return filteredResults;
  };

  filterByUserId(req.user.id)
    .then(data => {
      data.map(
        object =>
          (object.userIdWithItemName = object.userIdWithItemName.split("_")[1])
      );
      res.json(data);
    })
    .catch(err => next(err));
};

const removeGroceries = (req, res, next) => {
  const concatenatedUserWithItem = req.user.id + "_" + req.body.itemName;
  Grocery.findOneAndDelete(concatenatedUserWithItem)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => next(err));
};

module.exports = {
  createGroceries,
  getGroceries,
  findAndUpdateGroceries,
  removeGroceries
};
