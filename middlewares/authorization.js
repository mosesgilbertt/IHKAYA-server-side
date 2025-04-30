const { Product } = require("../models");

const admin = "Admin".toLowerCase();

const adminOnly = (req, res, next) => {
  try {
    if (req.user.role === "Admin" || req.user.role === admin) {
      next();
    } else {
      throw {
        name: "Forbidden",
        message: "You are not authorized",
      };
    }
  } catch (error) {
    next(error);
  }
};

const adminOrOwnerOnly = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw { name: "NotFound", message: `Product with id:${id} not found` };
    }

    if (
      req.user.role === "Admin" ||
      req.user.role === admin ||
      req.user.id === product.authorId
    ) {
      next();
    } else {
      throw {
        name: "Forbidden",
        message: "You are not authorized",
      };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminOnly,
  adminOrOwnerOnly,
};
