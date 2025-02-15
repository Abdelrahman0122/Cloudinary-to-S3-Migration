require('dotenv').config();
const connectDB = require('./config/database');
const migrationService = require('./services/migrationService');
const { Product, Category, Subcategory, CustomProduct } = require('./models');
const mongoose = require('mongoose');

const runMigration = async () => {
  try {
    console.log('🚀 Starting image migration...');
    
    // Connect to database
    await connectDB();

    // Process each collection
    await migrationService.processCollection(Product, ['images', 'imageCover']);
    await migrationService.processCollection(Category, ['image']);
    await migrationService.processCollection(Subcategory, ['image']);
    await migrationService.processCollection(CustomProduct, ['images']);
    
    console.log('✅ Image migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    // Cleanup and disconnect
    await migrationService.cleanup();
    await mongoose.disconnect();
  }
};

runMigration();