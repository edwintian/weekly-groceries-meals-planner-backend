----
IDEA: Meals and groceries shopping planner
----

This application is for planning grocery shopping as well as meal plan for the upcoming week.

There will be an inventory link to check on the ingredients in the fridge (age?).
Users can POST, PUT, GET to amend ingredients.

There will be a recipe link to tie the ingredients and their quantity to individual recipes.
Users can POST, PUT, GET to amend recipes.

There will be a mealplanner link with a form to fill up for all the meals in the upcoming week.
When the form is submitted via POST, we will subtract the ingredients from the DB in the backend, then inform the user if there is sufficient ingredients in the fridge.

Users will not be allowed to POST again to mealplanner link until the week is over (date tracking?).
In the meantime users will be able to GET the meal plan (saved form function?).
Before each user POST, we should delete the previous mealplan

There will be login/register links for user/new user.
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
Project brief
----
1. There will be a demo on Friday after lunch.
2. The demo should be shown on a deployed environment. Netlify, Express and MongoDb Atlas. 
Please please remember don’t commit the mongo url of Atlas into github
