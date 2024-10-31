const express = require("express");
const { authorize } = require("../controllers/auth.controller");
const { isAdmin } = require("../middleware/role-validation");
const mejaController = require("../controllers/meja.controller");

const app = express();
app.use(express.json());

app.get("/", authorize, mejaController.findAll);
app.get("/:id", authorize, mejaController.findById);
app.post("/", authorize,isAdmin, mejaController.create);
app.put("/:id", authorize, mejaController.update);
app.delete("/:id", authorize, isAdmin,  mejaController.delete);

module.exports = app;
