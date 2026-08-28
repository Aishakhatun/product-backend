require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user.model');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nrgandhi';

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected!');

    // 1. Clear database
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('Data cleared!');

    // 2. Create Users
    console.log('Creating users...');
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

    const customer = await User.create({
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

    console.log(`Users created: Admin (${admin.email}), Customer (${customer.email})`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
