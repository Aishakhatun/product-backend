require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nrgandhi';

const clearAllDummyData = async () => {
  try {
    console.log('Connecting to database to remove dummy data...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected!');

    // 1. Delete all products, categories, orders
    console.log('Wiping dummy orders...');
    await Order.deleteMany({});

    console.log('Wiping dummy products...');
    await Product.deleteMany({});

    console.log('Wiping dummy categories...');
    await Category.deleteMany({});

    // 2. Delete users
    console.log('Wiping user accounts...');
    await User.deleteMany({});

    // 3. Create fresh admin and user accounts
    console.log('Creating fresh admin and user accounts...');
    const admin = await User.create({
      username: 'Aisha Hub Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      phone: '9800000000',
      address: {
        street: '123 Innovation Boulevard',
        city: 'Commerce Park',
        state: 'Tech City',
        pincode: '10001',
        country: 'Country',
      },
    });

    const user = await User.create({
      username: 'Aisha Customer',
      email: 'user@gmail.com',
      password: 'user123',
      role: 'user',
      phone: '9876543210',
      address: {
        street: '45 Park Avenue',
        city: 'Commerce Park',
        state: 'Tech City',
        pincode: '10001',
        country: 'Country',
      },
    });

    console.log('====================================================');
    console.log('✅ SUCCESS: Database accounts updated!');
    console.log(`Admin Account: ${admin.email} (password: admin123)`);
    console.log(`User Account: ${user.email} (password: user123)`);
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing dummy data:', error);
    process.exit(1);
  }
};

clearAllDummyData();
