const testData = require("./test/testData/testData");
const testUserData = require("./test/testData/testUserData");
const request = require("supertest");
const app = require("./app");
const { teardownMongoose } = require("./test/mongoose");
const Company = require("./models/company.model");
const User = require("./models/user.model");
let signedInAgent;
