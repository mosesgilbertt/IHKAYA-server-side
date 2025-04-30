const { Op } = require("sequelize");
const { Product, Category } = require("../models");

class PublicController {
  static async getAllProducts(req, res, next) {
    const { search, filter, sortBy, page, limit } = req.query;
    try {
      let whereClause = {};

      if (search) {
        whereClause.name = { [Op.iLike]: `%${search}%` };
      }

      if (filter) {
        whereClause.categoryId = filter;
      }

      let order = [["createdAt", sortBy === "asc" ? "ASC" : "DESC"]];

      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const offset = (pageNumber - 1) * pageSize;

      const { rows: products, count: totalProducts } =
        await Product.findAndCountAll({
          where: whereClause,
          order: order,
          limit: pageSize,
          offset: offset,
        });

      res.status(200).json({
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / pageSize),
        totalProducts,
        products,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFound", message: `Product with id:${id} not found` };
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();

      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicController;
