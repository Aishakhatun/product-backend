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
const contactRoutes = require('./routes/contact.routes');

const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS with dynamic origin reflecting
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
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

// Health check & ping endpoints (Render keep-alive)
app.get(['/health', '/api/health', '/api/ping'], (req, res) => {
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
app.use('/api/contact', contactRoutes);

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Render Keep-Alive Self Ping (Every 14 minutes = 840,000ms)
  const KEEP_ALIVE_INTERVAL = 14 * 60 * 1000;
  setInterval(() => {
    const backendUrl = process.env.RENDER_EXTERNAL_URL || `http://127.0.0.1:${PORT}`;
    const httpLib = backendUrl.startsWith('https') ? require('https') : require('http');
    
    httpLib.get(`${backendUrl}/health`, (res) => {
      console.log(`[Keep-Alive Ping] Status: ${res.statusCode} at ${new Date().toISOString()}`);
    }).on('error', (err) => {
      console.log(`[Keep-Alive Self-Ping Note]: ${err.message}`);
    });
  }, KEEP_ALIVE_INTERVAL);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});
