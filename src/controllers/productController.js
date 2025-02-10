import Product from '../models/product.js';
import APIError from '../utils/apiError.js';

const productController = {

  createProduct: async (req, res, next) => {
    try {
      const newProduct = await Product.create(req.body);

      res.status(201).json({
        success: true,
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  },

  getAllProducts: async (req, res, next) => {
    const { category = "", title = "", address = "" } = req.query;
    const query = {isActive: true , isAproved: true};

    // Build query object based on provided filters
    if (category) query.category = new RegExp(category, 'i');
    if (title) query.title = new RegExp(title, 'i');
    if (address) query.address = new RegExp(address, 'i');

    try {

      const products = await Product.find(query)
        .catch(err => {
          console.error("Database query error:", err);
          throw new APIError('Database query failed', 500);
        });

      console.log(`Found ${products?.length || 0} products`);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      next(error);
    }
  },

  getProductById: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        throw new APIError('Product not found', 404);
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProduct) {
        throw new APIError('Product not found', 404);
      }

      res.json({
        success: true,
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  },

  deleteProduct: async (req, res, next) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      if (!deletedProduct) {
        throw new APIError('Product not found', 404);
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

export default productController;