const mongoose = require('mongoose');

const customProductSchema = new mongoose.Schema(
  { images: [String] },
  { collection: 'customproducts' }
);

module.exports = mongoose.model('CustomProduct', customProductSchema);