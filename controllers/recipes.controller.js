require("../utils/db");
const recipe = require("../models/recipe.model");
const Joi = require("@hapi/joi");
const recipeSchema = Joi.object({
  recipeName: Joi.string()
    .min(3)
    .required(),
  IsBreakfast: Joi.boolean()
    .required(),
  concatenatedIngredients: Joi.string()
    .min(1)
    .required()
});

const createRecipes = (req, res, next) => {
  const postContent = req.body;
  const result = recipeSchema.validate(postContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    recipe.create({
      userId: req.user.id,
      recipeName: postContent.recipeName,
      IsBreakfast: postContent.IsBreakfast,
      concatenatedIngredients: postContent.concatenatedIngredients
    })
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => next(err));
  }
};

const findAndUpdateRecipes = (req, res, next) => {
  const putContent = req.body;
  const result = recipeSchema.validate(putContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    recipe.findOneAndUpdate(
      { userId: req.user.id },
      {
        name: putContent.itemName,
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

const getRecipes = (req, res, next) => {
  recipe.find({
    userId: req.user.id
  })
    .select("-__v -_id")
    .then(data => {
      res.json(data);
    })
    .catch(err => next(err));
};

module.exports = {
  createRecipes,
  getRecipes,
  findAndUpdateRecipes
};
