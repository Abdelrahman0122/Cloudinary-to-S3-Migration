# Cloudinary to S3 Image Migration

Tool for migrating images from Cloudinary to AWS S3 and updating MongoDB records.

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your credentials
3. Install dependencies: `npm install`
4. Run the migration: `npm start`

## Features

- Migrates images from Cloudinary to AWS S3
- Updates MongoDB records with new S3 URLs
- Handles multiple collections (Products, Categories, etc.)
- Provides detailed logging
- Automatic cleanup of temporary files

## Configuration

Update `.env` file with your credentials:
- MongoDB connection string
- AWS credentials
- S3 bucket details

## Structure

```
src/
├── config/         # Configuration files
├── models/         # MongoDB models
├── services/       # Core services
└── utils/          # Utility functions
```