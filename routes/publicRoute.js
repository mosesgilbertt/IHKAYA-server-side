const express = require("express");
const PublicController = require("../controllers/publicController");

const publicRouter = express.Router();

publicRouter.get("/categories", PublicController.getAllCategories);

publicRouter.get("/products", PublicController.getAllProducts);

publicRouter.get("/products/:id", PublicController.getProductById);

module.exports = publicRouter;
