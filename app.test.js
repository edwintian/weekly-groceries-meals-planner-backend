const testGroceryData = require("./test/testData/testGroceryData");
const testRecipeData = require("./test/testData/testRecipeData");
const testMealPlanData = require("./test/testData/testMealPlanData");
const testUserData = require("./test/testData/testUserData");
const request = require("supertest");
const app = require("./app");
const { teardownMongoose } = require("./test/mongoose");
const Grocery = require("./models/grocery.model");
const Recipe = require("./models/recipe.model");
const MealPlan = require("./models/mealplan.model");
const User = require("./models/user.model");
let signedInAgent;

describe("users route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await User.create(testUserData);
    await Grocery.create(testGroceryData);
    await Recipe.create(testRecipeData);
    await MealPlan.create(testMealPlanData);
    signedInAgent = request.agent(app);
    const { text } = await signedInAgent
      .post("/users/login")
      .send(testUserData)
      .expect(200);
    expect(text).toEqual("You are now logged in!");
  });

  afterEach(async () => {
    await Grocery.deleteMany();
    await Recipe.deleteMany();
    await MealPlan.deleteMany();
    await User.deleteMany();
  });

  it("1) GET /users should return 200 and user info", async () => {
    const expectedUserInfo = {
      userId: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
      username: "humburn"
    };
    const { body: userInfo } = await signedInAgent.get("/users").expect(200);
    expect(userInfo).toEqual(expectedUserInfo);
  });

  it("2) POST /users/logout should return 200 with cookie cleared", async () => {
    const expectedUserInfo = {
      userId: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
      username: "humburn"
    };
    const response = await request(app)
      .post("/users/logout")
      .send(expectedUserInfo)
      .expect(200);
    expect(response.text).toEqual("You are now logged out!");
    expect(response.headers["set-cookie"][0]).toMatch(/^token=/);
  });

  it("3) GET /users/:id/groceries should return 200 with groceries for user", async () => {
    const expectedInfo = [
      {
        userIdWithItemName: "mushrooms",
        quantity: 2,
        unit: "packets"
      }
    ];
    const { body } = await signedInAgent
      .get("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/groceries")
      .expect(200);
    expect(body).toEqual(expectedInfo);
  });

  it("4) POST /users/:id/groceries should return 201 with new groceries for user", async () => {
    const expectedInfo = {
      userIdWithItemName: "cheese",
      quantity: 1,
      unit: "piece"
    };
    const sentInfo = {
      itemName: "cheese",
      quantity: 1,
      unit: "piece"
    };

    const { body } = await signedInAgent
      .post("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/groceries")
      .send(sentInfo)
      .expect(201);
    expect(body).toEqual(expectedInfo);
  });

  it("5) PUT /users/:id/groceries should return 201 with new groceries for user", async () => {
    const expectedInfo = {
      userIdWithItemName: "mushrooms",
      quantity: 1,
      unit: "packets"
    };
    const sentInfo = {
      itemName: "mushrooms",
      quantity: 1,
      unit: "packets"
    };

    const { body } = await signedInAgent
      .put("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/groceries")
      .send(sentInfo)
      .expect(201);
    expect(body).toEqual(expectedInfo);
  });

  it("6) GET /users/:id/recipes should return 200 with recipes for user", async () => {
    const expectedInfo = [
      {
        userIdWithRecipeName: "pizza",
        concatenatedIngredients: "2_mushrooms;1_cheese",
        IsBreakfast: true
      }
    ];
    const { body } = await signedInAgent
      .get("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/recipes")
      .expect(200);
    expect(body).toEqual(expectedInfo);
  });

  it("7) POST /users/:id/recipes should return 201 with new recipes for user", async () => {
    const expectedInfo = {
      userIdWithRecipeName: "cabbage rice",
      concatenatedIngredients: "1_cabbage;2_mushrooms;3_rice",
      IsBreakfast: false
    };
    const sentInfo = {
      recipeName: "cabbage rice",
      concatenatedIngredients: "1_cabbage;2_mushrooms;3_rice",
      IsBreakfast: false
    };

    const { body } = await signedInAgent
      .post("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/recipes")
      .send(sentInfo)
      .expect(201);
    expect(body).toEqual(expectedInfo);
  });

  it("8) PUT /users/:id/recipes should return 201 with new recipes for user", async () => {
    const expectedInfo = {
      userIdWithRecipeName: "pizza",
      concatenatedIngredients: "1_mushrooms;2_cheese",
      IsBreakfast: false
    };
    const sentInfo = {
      recipeName: "pizza",
      concatenatedIngredients: "1_mushrooms;2_cheese",
      IsBreakfast: false
    };

    const { body } = await signedInAgent
      .put("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/recipes")
      .send(sentInfo)
      .expect(201);
    expect(body).toEqual(expectedInfo);
  });

  it("9) GET /users/:id/mealplans should return 200 with mealplans for user", async () => {
    const expectedInfo = [
      {
        userId: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
        concatenatedMeals:
          "mushroom toasties_pizza_cabbage rice;mushroom toasties_pizza_cabbage rice;mushroom toasties_pizza_cabbage rice;mushroom toasties_pizza_cabbage rice;mushroom toasties_pizza_cabbage rice;mushroom toasties_pizza_cabbage rice;mushroom toasties_pizza_cabbage rice;"
      }
    ];
    const { body } = await signedInAgent
      .get("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/mealplans")
      .expect(200);
    expect(body).toEqual(expectedInfo);
  });

  it("10) POST /users/:id/mealplans should return 201 with new mealplans for user", async () => {
    const expectedInfo = {
      userId: "754aece9-64bf-42ab-b91c-bb65e2db3a37",
      concatenatedMeals: "1_2_3;1_2_3;1_2_3;1_2_3;1_2_3;1_2_3;1_2_3;"
    };

    const sentInfo = {
      concatenatedMeals: "1_2_3;1_2_3;1_2_3;1_2_3;1_2_3;1_2_3;1_2_3;"
    };

    const { body } = await signedInAgent
      .post("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/mealplans")
      .send(sentInfo)
      .expect(201);
    expect(body).toEqual(expectedInfo);
  });
});
