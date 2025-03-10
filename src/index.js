import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRouter from './routes/authRoute.js';
import dotenv from 'dotenv';
import productRouter from './routes/productRoute.js';
import userRouter from './routes/userRoute.js';
// import s3Router from './routes/s3Route.js';
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ecobuy24')
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});

// Security middleware
//app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
//app.use(mongoSanitize());
//.use(xss());
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
//app.use('/api/v1', limiter);

// Routes
app.get('/api/v1', (req, res) => {
  res.send('Hello World');
});
// API Routes
app.use('/api/v1', authRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1', userRouter);
//app.use('/api/v1', s3Router);


//
//
// export default app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
