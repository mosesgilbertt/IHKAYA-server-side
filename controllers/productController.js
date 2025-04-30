const { Product, User } = require("../models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class ProductController {
  static async addProduct(req, res, next) {
    const { name, description, price, stock, imgUrl, categoryId } = req.body;
    try {
      const product = await Product.create({
        name,
        description,
        price,
        stock,
        imgUrl,
        categoryId,
        authorId: req.user.id,
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        include: {
          model: User,
          attributes: { exclude: ["password"] },
        },
      });

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id, {
        include: {
          model: User,
          attributes: { exclude: ["password"] },
        },
      });
      if (!product) {
        throw { name: "NotFound", message: `Product with id:${id} not found` };
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async updateProductById(req, res, next) {
    const { id } = req.params;
    const { name, description, price, stock, imgUrl, categoryId } = req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound", message: `Product with id:${id} not found` };
      }

      await product.update({
        name,
        description,
        price,
        stock,
        imgUrl,
        categoryId,
      });

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound", message: `Product with id:${id} not found` };
      }

      await product.destroy();

      res.status(200).json({ message: `${product.name} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }

  static async updateImage(req, res, next) {
    const { id } = req.params;
    const { file } = req;
    try {
      if (!file) {
        throw { name: "BadRequest", message: "Image is required" };
      }

      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound", message: `Product with id:${id} not found` };
      }

      const mediaType = req.file.mimetype;
      const base64Data = req.file.buffer.toString("base64");
      const fileName = req.file.originalname;

      const base64 = `data:${mediaType};base64,${base64Data}`;

      const result = await cloudinary.uploader.upload(base64, {
        public_id: fileName,
        folder: "Graded Challenge 1 - repeat",
      });

      await product.update({ imgUrl: result.secure_url });

      res.json({ message: `Image ${product.name} success to update` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
