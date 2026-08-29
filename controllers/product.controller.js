const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Helper to ensure admin and user accounts exist on backend startup
const seedIfNeeded = async () => {
  try {
    const User = require('../models/user.model');
    
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
  } catch (err) {
    console.warn('[Account Check Note]:', err.message);
  }
};

// @desc    Clear all products and categories from database (Admin)
// @route   DELETE /api/products/clear-all
// @access  Private/Admin
exports.clearAllProducts = async (req, res, next) => {
  try {
    const prodRes = await Product.deleteMany({});
    const catRes = await Category.deleteMany({});
    res.json({
      success: true,
      message: `Cleared all dummy data. Deleted ${prodRes.deletedCount} products and ${catRes.deletedCount} categories from database.`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (with search, category, sort, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    await seedIfNeeded();
    const queryObj = { isDeleted: { $ne: true } };

    if (req.query.search) {
      queryObj.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    if (req.query.category) {
      const cat = await Category.findOne({
        $or: [
          { _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null },
          { slug: req.query.category },
        ].filter(Boolean),
      });

      if (cat) {
        queryObj.category = cat._id;
      } else {
        return res.json({ success: true, count: 0, pagination: {}, data: [] });
      }
    }

    if (req.query.isFeatured) {
      queryObj.isFeatured = req.query.isFeatured === 'true';
    }

    let query = Product.find(queryObj).populate('category', 'name slug');

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const total = await Product.countDocuments(queryObj);

    query = query.skip(startIndex).limit(limit);

    const products = await query;

    res.json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        total,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    await seedIfNeeded();
    const products = await Product.find({ isFeatured: true })
      .populate('category', 'name slug')
      .limit(6);

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    await seedIfNeeded();
    let product;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: req.params.id }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isDeleted = true;
    product.isAvailable = false;
    await product.save();

    res.json({ success: true, message: 'Product soft deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Please select a valid star rating (1 to 5)' });
    }

    const newReview = {
      user: req.user.id,
      username: req.user.username || req.user.email || 'Verified Customer',
      name: req.user.username || req.user.email || 'Verified Customer',
      rating: Number(rating),
      comment: comment || '',
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    if (typeof product.updateAverageRating === 'function') {
      product.updateAverageRating();
    } else {
      product.averageRating = Math.round((product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length) * 10) / 10;
    }

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: product.reviews
    });
  } catch (error) {
    next(error);
  }
};
