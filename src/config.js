import dotenv from 'dotenv';

dotenv.config();

export function getConfig() {

  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('AWS_ACCESS_KEY_ID is not defined');
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY is not defined');
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  if (!process.env.AWS_REGION) {
    throw new Error(' AWS_REGION is not defined');
  }
  const awsConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };

  return {
    SERVER_PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGO_URL || 'mongodb://localhost:27017/ecobuy24',
    CLIENT_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '30d',
    NODE_ENV: process.env.NODE_ENV || 'development',
    AWS_CONFIG: awsConfig,
    AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME || 'ecobuy24',
    AWS_REGION: process.env.AWS_REGION || 'eu-central-1',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  };
}
