// src/models/product.js (Mongoose Schema)
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  
  desc: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  
  category: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
 
},
{
  timestamps: true,

}

);

const Product = mongoose.model('Product', productSchema);

export default Product;
