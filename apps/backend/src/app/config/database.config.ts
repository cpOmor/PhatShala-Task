import mongoose, { ConnectOptions } from 'mongoose';
import config from '.';


/**
 * Function to establish a connection to the MongoDB database
 * - It supports both production and development environments
 * - Seeds the database with initial data after a successful connection
 */
export async function databaseConnecting() {
  try { 
    // Check if the production database URI is available
    if (config.mongo_uri_prod && config.mongo_prod) {
      // Connect to the production MongoDB database
      await mongoose.connect(config.mongo_uri_prod, {
        useNewUrlParser: true, // Ensures compatibility with the MongoDB driver
        useUnifiedTopology: true, // Enables the new connection management engine
        serverSelectionTimeoutMS: 1000, // Timeout for selecting a MongoDB server
      } as ConnectOptions);

      console.log('Database      :🚀 Connected to database (Production)');
    } else if (config.mongo_uri_dev) {
      // If production URI is not provided, connect to the development database
      await mongoose.connect(config.mongo_uri_dev, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 1000,
      } as ConnectOptions);

      console.log('Database      :🚀 Connected to database (Development)');
    } else {
      throw new Error('No valid MongoDB URI provided in config.');
    }
  } catch (error) {
    // Log any errors that occur during the database connection attempt
    console.error('Database      :🙄 Error connecting to the database');
  }
}
