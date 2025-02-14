import Product from '../models/product.js';
import APIError from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
const productController = {

  createProduct: async (req, res, next) => {

    try {

        const newProduct = await Product.create({...req.body , userId:"65d23f8b9c1e3a001f2a4b6c" , isActive: true, isAproved: true });
      // res with new product
      res.status(201).json({
        success: true,
         data: newProduct
      });

    } catch (error) {
      next(error);
    }
  },
// Get all products
  getAllProducts: async (req, res, next) => {
    const { category = "", title = "", address = "", currentPage = 1, pageSize = 12} = req.query;
    const query = { isActive: true };

    // Build query object based on provided filters
    if (category) query.category = new RegExp(category, 'i');
    if (title) query.title = new RegExp(title, 'i');
    if (address) query.address = new RegExp(address, 'i');

    try {
      const skip = (currentPage - 1) * pageSize;
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProducts / pageSize);

      const products = await Product.find(query)
        .skip(skip)
        .limit(pageSize)
        .catch(err => {
          console.error("Database query error:", err);
          throw new APIError('Database query failed', 500);
        });

      console.log(`Found ${products?.length || 0} products`);

      res.json({
        success: true,
        data: products,
        pagination: {
          currentPage: parseInt(currentPage,10),
          pageSize: parseInt(pageSize,10),
          totalPages,
          totalProducts
        }
      });
    } catch (error) {
      console.error("Error in getAllProducts:", error);
      next(error);
    }
  },
  // Get products by user id
  getProductsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const products = await Product.find({ userId: userId });
      console.log(`Found ${products?.length || 0} products for user ${userId}`);
      if (!products) {
        throw new APIError('Products not found', 404);
      }

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  },
  // Get single product

  getProductById: async (req, res, next) => {
    try {
      const id =  req.params.id;
      if (!id) {
        return next(new APIError('Product ID is required', 400));
      }
      const product = await Product.findById(id);
      console.log(product, "product");

      if (!product) {
        throw new APIError('Product not found', 404);
      }
      res.json({
        success: true,
        data:product
      });
    } catch (error) {
      next(error);
    }
  },
// Update product
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
// Delete product
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