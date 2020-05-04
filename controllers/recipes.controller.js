require("../utils/db");
const Recipe = require("../models/Recipe.model");
const Joi = require("@hapi/joi");
const RecipeSchema = Joi.object({
  recipeName: Joi.string()
    .min(3)
    .required(),
  concatenatedIngredients: Joi.number()
    .min(1)
    .required(),
  IsBreakfast: Joi.boolean()
    .required()
});

const createRecipes = (req, res, next) => {
  const postContent = req.body;
  const result = RecipeSchema.validate(postContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    const concatenatedUserWithItem = req.user.id + "_" + postContent.recipeName;
    Recipe.create({
      userIdWithRecipeName: concatenatedUserWithItem,
      concatenatedIngredients: postContent.concatenatedIngredients,
      IsBreakfast: postContent.IsBreakfast
    })
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => next(err));
  }
};

const findAndUpdateRecipes = (req, res, next) => {
  const putContent = req.body;
  const result = RecipeSchema.validate(putContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    const concatenatedUserWithItem = req.user.id + "_" + putContent.itemName;
    Recipe.findOneAndUpdate(
      { userIdWithRecipeName: concatenatedUserWithItem },
      {
        concatenatedIngredients: putContent.concatenatedIngredients,
        IsBreakfast: putContent.IsBreakfast
      }
    )
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => next(err));
  }
};

const getRecipes = (req, res, next) => {
  Recipe.find({ "userIdWithRecipeName": /"$req.user.id"/i })
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
