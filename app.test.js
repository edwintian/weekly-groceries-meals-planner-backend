const testGroceryData = require("./test/testData/testGroceryData");
const testRecipeData = require("./test/testData/testRecipeData");
const testUserData = require("./test/testData/testUserData");
const request = require("supertest");
const app = require("./app");
const { teardownMongoose } = require("./test/mongoose");
const Grocery = require("./models/grocery.model");
const Recipe = require("./models/recipe.model");
const User = require("./models/user.model");
let signedInAgent;

describe("users route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await User.create(testUserData);
    await Grocery.create(testGroceryData);
    await Recipe.create(testRecipeData);
    signedInAgent = request.agent(app);
    const { text } = await signedInAgent
      .post("/users/login")
      .send(testUserData)
      .expect(200);
    expect(text).toEqual("You are now logged in!");
  });

  afterEach(async () => {
    await Grocery.deleteMany();
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

  // it("4) POST /users/:id/recipes should return 201 with new recipes for user", async () => {
  //   const expectedInfo = {
  //     userIdWithItemName: "cheese",
  //     quantity: 1,
  //     unit: "piece"
  //   };
  //   const sentInfo = {
  //     itemName: "cheese",
  //     quantity: 1,
  //     unit: "piece"
  //   };
  //
  //   const { body } = await signedInAgent
  //     .post("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/groceries")
  //     .send(sentInfo)
  //     .expect(201);
  //   expect(body).toEqual(expectedInfo);
  // });
  //
  // it("5) PUT /users/:id/recipes should return 201 with new recipes for user", async () => {
  //   const expectedInfo = {
  //     userIdWithItemName: "mushrooms",
  //     quantity: 1,
  //     unit: "packets"
  //   };
  //   const sentInfo = {
  //     itemName: "mushrooms",
  //     quantity: 1,
  //     unit: "packets"
  //   };
  //
  //   const { body } = await signedInAgent
  //     .put("/users/754aece9-64bf-42ab-b91c-bb65e2db3a37/groceries")
  //     .send(sentInfo)
  //     .expect(201);
  //   expect(body).toEqual(expectedInfo);
  // });
});
