const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./config');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    if (!config.mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    const conn = await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error.message}`);
  }
};

module.exports = { connectDB, closeDB };
