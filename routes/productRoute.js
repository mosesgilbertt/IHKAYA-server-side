const express = require("express");
const multer = require("multer");
const ProductController = require("../controllers/productController");
const upload = multer({ storage: multer.memoryStorage() });
const { adminOrOwnerOnly } = require("../middlewares/authorization");

const productRouter = express.Router();

productRouter.post("/", ProductController.addProduct);

productRouter.get("/", ProductController.getAllProducts);

productRouter.get("/:id", ProductController.getProductById);

productRouter.put(
  "/:id",
  adminOrOwnerOnly,
  ProductController.updateProductById
);

productRouter.patch(
  "/:id",
  adminOrOwnerOnly,
  upload.single("imgUrl"),
  ProductController.updateImage
);

productRouter.delete("/:id", adminOrOwnerOnly, ProductController.deleteProduct);

module.exports = productRouter;
