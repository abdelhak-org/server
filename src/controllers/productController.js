import Product from '../models/product.js';
import APIError from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import User from "../models/user.js";

const productController = {

  createProduct: async (req, res, next) => {
    try {
      const token =  req.cookies.ecobuy24_token;
      if (!token) return res.status(401).json({ message: "Access Denied" });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new APIError('No user found with this id', 404);
      }
      // Create new product
       const newProduct = await Product.create({...req.body , userId:user._id , isActive: true, isAproved: true });
      //res with new product
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
      const { category = "", title = "", address = "", currentPage = 1, pageSize = 12, userId, isAproved, minPrice, maxPrice, sortBy="newest" } = req.query;
      const query = { isActive: true };
      // Build query object based on provided filters
      if (category) query.category = new RegExp(category, 'i');
      if (title) query.title = new RegExp(title, 'i');
      if (address) query.address = new RegExp(address, 'i');
      if (minPrice) query.price = { ...query.price, $gte: minPrice };
      if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
      if (userId) query.userId = userId;
      if (isAproved !== undefined) query.isAproved = isAproved;

      // Determine sort order based on sortBy parameter
      const sortOrder = { updatedAt: -1 }; // Default to newest first
       if (sortBy === 'oldest') {
        sortOrder.updatedAt = 1;
      } else if (sortBy === 'priceAsc') {
        sortOrder.price = 1;
      } else if (sortBy === 'priceDesc') {
        sortOrder.price = -1;
      } else if (sortBy === 'newest') {
        sortOrder.updatedAt = -1;
      }
      try {
        const skip = (currentPage - 1) * pageSize;
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / pageSize);

        const products = await Product.find(query)
          .sort(sortOrder)
          .skip(skip)
          .limit(pageSize);

        res.json({
          success: true,
          data: products,
          pagination: {
            currentPage: parseInt(currentPage, 10),
            pageSize: parseInt(pageSize, 10),
            totalPages,
            totalProducts
          }
        });
      } catch (error) {
        next(error);
      }


  },
  // Get products by user id
  getProductsByUserId: async (req, res, next) => {
    const { userId } = req.params;
    try {
      const products = await Product.find({ userId: userId }).sort({ createdAt: -1 })
      ;
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
  // deactivate product
  deactivateProduct: async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        throw new APIError('Product not found', 404);
      }

      product.isActive = !product.isActive;
      const updatedProduct = await product.save();

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