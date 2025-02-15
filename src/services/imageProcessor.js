const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { s3, S3_BUCKET, S3_REGION } = require('../config/aws');
const { PutObjectCommand } = require('@aws-sdk/client-s3');

class ImageProcessor {
  async downloadImage(url, filePath) {
    try {
      const response = await axios({ url, responseType: 'arraybuffer' });
      await fs.writeFile(filePath, response.data);
      return true;
    } catch (error) {
      console.error(`❌ Error downloading ${url}:`, error.message);
      return false;
    }
  }

  async uploadToS3(filePath, key) {
    try {
      const fileContent = await fs.readFile(filePath);
      const params = {
        Bucket: S3_BUCKET,
        Key: `images/${key}`,
        Body: fileContent,
        ContentType: 'image/png',
      };

      await s3.send(new PutObjectCommand(params));
      await fs.unlink(filePath);
      return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${params.Key}`;
    } catch (error) {
      console.error(`❌ Error uploading ${key}:`, error.message);
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        // Ignore unlink errors
      }
      return null;
    }
  }

  async processImage(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.log('⚠️ Skipping invalid image URL:', imageUrl);
      return null;
    }

    if (!imageUrl.includes('cloudinary')) return imageUrl;
    if (imageUrl.includes('s3')) return imageUrl;

    console.log(`🔍 Processing: ${imageUrl}`);

    try {
      const fileName = path.basename(imageUrl);
      const tempDir = path.join(process.cwd(), 'temp');
      const filePath = path.join(tempDir, fileName);

      await fs.mkdir(tempDir, { recursive: true });

      const downloaded = await this.downloadImage(imageUrl, filePath);
      if (!downloaded) {
        return null;
      }

      console.log(`🚀 Uploading to S3: ${fileName}`);
      const s3Url = await this.uploadToS3(filePath, fileName);
      
      if (s3Url) {
        console.log(`✅ Successfully migrated: ${fileName}`);
      }
      return s3Url;
    } catch (error) {
      console.error(`❌ Error processing ${imageUrl}:`, error.message);
      return null;
    }
  }
}

module.exports = new ImageProcessor();