----
IDEA: Meals and groceries shopping planner
----

This application is for planning grocery shopping as well as meal plan for the upcoming week.

There will be an groceries API to check on the ingredients in the fridge (age?).
Users can POST, PUT, GET to amend ingredients.

There will be a recipes API to tie the ingredients and their quantity to individual recipes.
Users can POST, PUT, GET to amend recipes.

There will be a mealplanner API with a form to fill up for all the meals in the upcoming week.
When the form is submitted via POST, we will subtract the ingredients from the DB in the backend, then inform the user if there is sufficient ingredients in the fridge.

There will be login/logout/register API for user/new user.
All other routes should be protected unless user is authenticated (login) and authorized using jwt.

----
ROUTES
----
{
  "0": "GET /",
  "1": "GET /users",
  "2": "POST /users/register",
  "3": "POST /users/login",
  "4": "POST /users/logout",
  "5": "GET /users/:id/groceries",
  "6": "PUT /users/:id/groceries",
  "7": "POST /users/:id/groceries",
  "8": "GET /users/:id/recipes",
  "9": "PUT /users/:id/recipes",
  "10": "POST /users/:id/recipes",
  "11": "GET /users/:id/mealplans",
  "12": "POST /users/:id/mealplans",
}

----
MODELS
----
Groceries: userIdWithitemName|quantity|unit
Recipes: userIdWithrecipeName|concatenatedIngredients|IsBreakfast
MealPlans: userId|concatenatedMeals

----
PROGRESS THUS FAR
----
1. Has integrated all users login/logout/register API with frontend
2. Has integrated all CRUD groceries API with frontend
3. Only managed to integrate CREATE recipes API with frontend
