const express = require("express")
const router = express.Router()
const userController = require("./controllers")

router.post("/register",userController.addUser)
router.post("/login",userController.loginUser)

module.exports = router