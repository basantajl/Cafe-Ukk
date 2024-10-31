const express = require("express");
const { authorize } = require("../controllers/auth.controller");
const { isAdmin } = require("../middleware/role-validation");
const menuController = require("../controllers/menu.controller");

const app = express();
app.use(express.json());

app.get("/", authorize, menuController.findAll);
app.get("/:id", authorize, menuController.findById);
app.get("/search/:keyword", authorize, menuController.search);
app.post("/", authorize, isAdmin, menuController.create);
app.put("/:id", authorize, isAdmin, menuController.update);
app.delete("/:id", authorize, isAdmin, menuController.delete);

module.exports = app;
