const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
  { image: String },
  { collection: 'subcategories' }
);

module.exports = mongoose.model('Subcategory', subcategorySchema);