const express = require("express")
const { authorize } = require("../controllers/auth.controller")
const { isAdmin } = require("../middleware/role-validation")
const userController = require("../controllers/user.controller")

const app = express()
app.use(express.json())

app.get("/", authorize, isAdmin, userController.findAll)
app.get("/:id", authorize, isAdmin, userController.findById)
app.post("/", authorize, isAdmin, userController.create)
app.put("/:id", authorize, isAdmin, userController.update)
app.delete("/:id", authorize, isAdmin, userController.delete)
app.get("/search/:keyword", authorize, isAdmin, userController.searchByKeyword)

module.exports = app
