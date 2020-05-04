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
In the meantime users will be able to retrieve the meal plan (saved form function?).

There will be login/register links for user/new user.
All other routes should be protected unless user is authenticated (login) and authorized using jwt.
