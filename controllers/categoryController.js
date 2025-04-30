const { Category } = require("../models");

class CategoryController {
  static async addCategory(req, res, next) {
    const { name } = req.body;
    try {
      const category = await Category.create({ name });

      res.status(201).json({ category });
    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll();

      res.status(200).json({ categories });
    } catch (error) {
      next(error);
    }
  }

  static async updateCategoryById(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw { name: "NotFound", message: `Category with id:${id} not found` };
      }

      await category.update({ name });

      res.status(200).json({ category });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
