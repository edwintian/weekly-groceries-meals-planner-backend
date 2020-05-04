const testGroceryData = require("./test/testData/testGroceryData");
const testUserData = require("./test/testData/testUserData");
const request = require("supertest");
const app = require("./app");
const { teardownMongoose } = require("./test/mongoose");
const Grocery = require("./models/grocery.model");
const User = require("./models/user.model");
let signedInAgent;

describe("users route", () => {
  afterAll(async () => await teardownMongoose());

  beforeEach(async () => {
    await User.create(testUserData);
    await Grocery.create(testGroceryData);
    signedInAgent = request.agent(app);
    const {text} = await signedInAgent.post("/users/login").send(testUserData).expect(200);
    expect(text).toEqual("You are now logged in!");
  });

  afterEach(async () => {
    await Grocery.deleteMany();
    await User.deleteMany();
    //jest.resetAllMocks();
  });

  it("1) GET /users should return 200 and user info", async () => {
    const expectedUserInfo = {
        "userId": "754aece9-64bf-42ab-b91c-bb65e2db3a37",
        "username": "humburn",
      };
    const { body: userInfo } = await signedInAgent
      .get("/users")
      .expect(200);
    expect(userInfo).toEqual(expectedUserInfo);
  });

  it("2) POST /users/logout should return 200 with cookie cleared", async () => {
    const expectedUserInfo = {
        "userId": "754aece9-64bf-42ab-b91c-bb65e2db3a37",
        "username": "humburn",
      };
    const response = await request(app)
      .post("/users/logout")
      .send(expectedUserInfo)
      .expect(200);
    expect(response.text).toEqual("You are now logged out!");
    expect(response.headers["set-cookie"][0]).toMatch(/^token=/);
  });

});
