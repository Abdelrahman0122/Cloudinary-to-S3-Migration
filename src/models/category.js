const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  { image: String },
  { collection: 'categories' }
);

module.exports = mongoose.model('Category', categorySchema);
