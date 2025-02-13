// src/models/product.js (Mongoose Schema)
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId :{
    type: mongoose.Schema.Types.ObjectId,
    required: true ,
  },

  title: {
    type: String,
    required: true,
  },

  desc: {
    type: String,
    required: true,
  },
  price: {
    type: Number ,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },

  isActive :{
    type: Boolean,
    default: true,
  },
  isAproved :{
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,

}

);

const Product = mongoose.model('Product', productSchema);

export default Product;
