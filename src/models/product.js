import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  address:{
    type:String,
    required:true
  },
  contact:{
    type:String,
    required:false
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  isAproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
