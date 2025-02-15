const imageProcessor = require('./imageProcessor');
const fs = require('fs').promises;
const path = require('path');

class MigrationService {
  async processCollection(model, fields) {
    const records = await model.find();
    console.log(`📦 Processing ${records.length} ${model.collection.collectionName}...`);

    for (const record of records) {
      try {
        const updates = {};
        let hasUpdates = false;

        for (const field of fields) {
          if (!record[field]) {
            console.log(`ℹ️ Skipping empty field '${field}' for record: ${record._id}`);
            continue;
          }

          if (Array.isArray(record[field])) {
            const processedUrls = await Promise.all(
              record[field].map(url => imageProcessor.processImage(url))
            );
            const validUrls = processedUrls.filter(url => url !== null);
            if (validUrls.length > 0) {
              updates[field] = validUrls;
              hasUpdates = true;
            }
          } else {
            const processedUrl = await imageProcessor.processImage(record[field]);
            if (processedUrl) {
              updates[field] = processedUrl;
              hasUpdates = true;
            }
          }
        }

        if (hasUpdates) {
          await model.updateOne({ _id: record._id }, { $set: updates });
          console.log(`✅ Updated ${model.collection.collectionName}: ${record._id}`);
        }
      } catch (error) {
        console.error(`❌ Error processing record ${record._id}:`, error.message);
      }
    }
  }

  async cleanup() {
    try {
      await fs.rmdir(path.join(process.cwd(), 'temp'), { recursive: true });
    } catch (error) {
      console.error('⚠️ Error cleaning up temp directory:', error.message);
    }
  }
}

module.exports = new MigrationService();