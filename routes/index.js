const express = require("express");
const authentication = require("../middlewares/authentication");

const UserController = require("../controllers/userController");

const publicRouter = require("./publicRoute");
const categoryRouter = require("./categoryRoute");
const productRouter = require("./productRoute");
const { adminOnly } = require("../middlewares/authorization");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

router.use("/pub", publicRouter);
router.post("/login", UserController.login);

router.use(authentication);

router.post("/add-user", adminOnly, UserController.addUser);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);

module.exports = router;
