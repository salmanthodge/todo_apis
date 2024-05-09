const express = require("express");
const appModules = express.Router();

const userModules = require("../modules/apis/user/routes")
const taskModules = require("../modules/apis/task/routes")

appModules.use("/api/v1",userModules)
appModules.use("/api/v1",taskModules)

module.exports = appModules