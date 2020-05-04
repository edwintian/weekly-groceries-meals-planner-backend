require("../utils/db");
const MealPlan = require("../models/mealplan.model");
const Joi = require("@hapi/joi");
const mealPlanSchema = Joi.object({
  concatenatedMeals: Joi.string()
    .min(3)
    .required()
});

const deleteAndCreateMealPlan = async (req, res, next) => {
  const postContent = req.body;
  const result = mealPlanSchema.validate(postContent);
  if (result.error) {
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
    //note that we should not have any more processing after calling next(err)
  } else {
    await MealPlan.deleteOne({ userId: req.user.id });
    MealPlan.create({
      userId: req.user.id,
      concatenatedMeals: postContent.concatenatedMeals
    })
      .then(data => {
        res.status(201).json(data);
      })
      .catch(err => next(err));
  }
};

const getMealPlan = (req, res, next) => {
  MealPlan.find({ "userId": /"$req.user.id"/i })
    .select("-__v -_id")
    .then(data => {
      res.json(data);
    })
    .catch(err => next(err));
};

module.exports = {
  getMealPlan,
  deleteAndCreateMealPlan
};
