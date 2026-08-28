const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aishahub';
  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Primary Database Connection Note: ${error.message}`);
    if (primaryUri !== 'mongodb://127.0.0.1:27017/aishahub') {
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/aishahub');
        console.log(`Fallback Local MongoDB Connected: ${localConn.connection.host}`);
      } catch (localError) {
        console.error(`Fallback Database Note: ${localError.message}`);
      }
    }
  }
};

module.exports = connectDB;
