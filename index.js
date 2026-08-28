require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = async () => {
  const conn = require('./config/db');
  await conn();
};
const { errorHandler } = require('./middleware/error.middleware');

// Route files
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: '*', // Allow Vercel frontend
    credentials: true,
  })
);

// Rate limiting - 300 requests per 10 minutes for security
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again after 10 minutes' },
});
app.use('/api', limiter);

// Health check & ping endpoints
app.get(['/', '/health', '/api/health', '/api/ping'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Aisha Hub API Server',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
