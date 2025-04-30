const express = require("express");
const CategoryController = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter.post("/", CategoryController.addCategory);

categoryRouter.get("/", CategoryController.getAllCategories);

categoryRouter.put("/:id", CategoryController.updateCategoryById);

module.exports = categoryRouter;
