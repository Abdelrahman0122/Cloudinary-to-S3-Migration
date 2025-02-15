const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  { 
    imageCover: String, 
    images: [String] 
  },
  { collection: 'products' }
);

module.exports = mongoose.model('Product', productSchema);