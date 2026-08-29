require('dotenv').config();
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const mongoose = require('mongoose');
const User = require('./models/user.model');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Order = require('./models/order.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aishahub';

const clearAllDummyData = async () => {
  try {
    console.log('Connecting to database to remove dummy products...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected!');

    console.log('Wiping all dummy products from database...');
    const prodRes = await Product.deleteMany({});
    console.log(`Deleted ${prodRes.deletedCount} dummy products.`);

    console.log('Wiping dummy categories...');
    const catRes = await Category.deleteMany({});
    console.log(`Deleted ${catRes.deletedCount} categories.`);

    console.log('Wiping dummy orders...');
    const orderRes = await Order.deleteMany({});
    console.log(`Deleted ${orderRes.deletedCount} orders.`);

    // Ensure admin and user accounts exist
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      await User.create({
        username: 'Aisha Hub Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        phone: '9800000000',
        address: { street: '123 Innovation Blvd', city: 'Commerce Park', state: 'Tech City', pincode: '10001', country: 'Country' }
      });
    }

    const userExists = await User.findOne({ email: 'user@gmail.com' });
    if (!userExists) {
      await User.create({
        username: 'Aisha Customer',
        email: 'user@gmail.com',
        password: 'user123',
        role: 'user',
        phone: '9876543210',
        address: { street: '45 Park Ave', city: 'Commerce Park', state: 'Tech City', pincode: '10001', country: 'Country' }
      });
    }

    console.log('====================================================');
    console.log('✅ SUCCESS: All dummy products removed from MongoDB database!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing dummy data:', error);
    process.exit(1);
  }
};

clearAllDummyData();
