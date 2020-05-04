require("../utils/db");
const Grocery = require("../models/grocery.model");
const Joi = require("@hapi/joi");
const grocerySchema = Joi.object({
  itemName: Joi.string()
    .min(3)
    .required(),
  quantity: Joi.number()
    .min(1)
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
        res.status(201).json(data);
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
      }
    )
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => next(err));
  }
};

const getGroceries = (req, res, next) => {
  Grocery.find({ "userIdWithItemName": /"$req.user.id"/i })
    .select("-__v -_id")
    .then(data => {
      res.json(data);
    })
    .catch(err => next(err));
};

module.exports = {
  createGroceries,
  getGroceries,
  findAndUpdateGroceries
};
