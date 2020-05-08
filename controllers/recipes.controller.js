require("../utils/db");
const Recipe = require("../models/recipe.model");
const Joi = require("@hapi/joi");
const RecipeSchema = Joi.object({
  recipeName: Joi.string()
    .min(3)
    .required(),
  concatenatedIngredients: Joi.string()
    .min(1)
    .required(),
  IsBreakfast: Joi.boolean().required()
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
        let output = {};
        for (const key in data.toObject()) {
          if (key != "_id" && key != "__v") {
            output[key] = data[key];
          }
          if (key === "userIdWithRecipeName") {
            output[key] = data[key].split("_")[1];
          }
        }
        res.status(201).json(output);
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
    const concatenatedUserWithItem = req.user.id + "_" + putContent.recipeName;
    Recipe.findOneAndUpdate(
      { userIdWithRecipeName: concatenatedUserWithItem },
      {
        concatenatedIngredients: putContent.concatenatedIngredients,
        IsBreakfast: putContent.IsBreakfast
      },
      { new: true }
    )
      .then(data => {
        let output = {};
        for (const key in data.toObject()) {
          if (key != "_id" && key != "__v") {
            output[key] = data[key];
          }
          if (key === "userIdWithRecipeName") {
            output[key] = data[key].split("_")[1];
          }
        }
        res.status(201).json(output);
      })
      .catch(err => {
        next(err);
      });
  }
};

const getRecipes = (req, res, next) => {
  const filterByUserId = async userIdWithRecipeName => {
    const regex = new RegExp(userIdWithRecipeName, "gi");
    const filteredResults = await Recipe.find({
      userIdWithRecipeName: regex
    }).select("-__v -_id");
    return filteredResults;
  };

  filterByUserId(req.user.id)
    .then(data => {
      data.map((object) => object.userIdWithRecipeName = object.userIdWithRecipeName.split("_")[1]);
      res.json(data);
    })
    .catch(err => next(err));
};

module.exports = {
  createRecipes,
  getRecipes,
  findAndUpdateRecipes
};
