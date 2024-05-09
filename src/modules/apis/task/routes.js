const express = require("express")
const router = express.Router()
const taskController = require("./controllers")
const authMiddleware = require("../../../middlewares/authMiddleware")

router.post("/task",authMiddleware, taskController.addTasks)
router.get("/task/:user_id",authMiddleware, taskController.getTasks)
router.put("/task/:task_id",authMiddleware,taskController.updateTask)
router.delete("/task/:task_id",authMiddleware,taskController.deleteTask)

module.exports = router