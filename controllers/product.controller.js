const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Helper to auto-seed 12 products + admin/user if database is empty
const seedIfNeeded = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Auto-Seed] Database empty. Pre-populating products and accounts...');
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

      let shampoosCat = await Category.findOne({ slug: 'shampoos' });
      if (!shampoosCat) shampoosCat = await Category.create({ name: 'Shampoos', slug: 'shampoos', description: 'Organic botanical & herbal shampoos' });
      
      let oilsCat = await Category.findOne({ slug: 'hair-oils' });
      if (!oilsCat) oilsCat = await Category.create({ name: 'Hair Oils', slug: 'hair-oils', description: 'Nourishing botanical hair oils' });
      
      let dressesCat = await Category.findOne({ slug: 'dresses' });
      if (!dressesCat) dressesCat = await Category.create({ name: 'Dresses', slug: 'dresses', description: 'Elegant handcrafted organic dresses' });

      await Product.insertMany([
        { name: 'Herbal Essence Nourishing Shampoo', slug: 'herbal-essence-nourishing-shampoo', category: shampoosCat._id, description: 'Enriched with organic aloe vera, neem, and bhringraj extracts to strengthen roots and restore natural shine.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 200, price: 349, stock: 45 }, { grams: 500, price: 699, stock: 30 }] },
        { name: 'Onion & Red Clover Anti-Hairfall Shampoo', slug: 'onion-red-clover-shampoo', category: shampoosCat._id, description: 'Potent formula with cold-pressed red onion seed oil to reduce hair breakage and stimulate follicle regrowth.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 250, price: 425, stock: 50 }, { grams: 500, price: 799, stock: 25 }] },
        { name: 'Tea Tree Purifying Anti-Dandruff Shampoo', slug: 'tea-tree-anti-dandruff-shampoo', category: shampoosCat._id, description: 'Infused with Australian tea tree oil and salicylic acid to gently cleanse flakes and soothe itchy scalp.', isFeatured: false, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 200, price: 380, stock: 40 }, { grams: 400, price: 650, stock: 20 }] },
        { name: 'Argan Oil Deep Moisture Cleanser', slug: 'argan-oil-moisture-shampoo', category: shampoosCat._id, description: 'Moroccan argan oil enriched shampoo for frizzy, dry, or chemically treated hair seeking silky smoothness.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 300, price: 499, stock: 35 }, { grams: 600, price: 899, stock: 15 }] },
        { name: 'Hibiscus & Coconut Volumizing Cleanser', slug: 'hibiscus-coconut-volumizing-shampoo', category: shampoosCat._id, description: 'Lightweight botanical cleanser with Hibiscus flower extract to add bounce, body, and volume.', isFeatured: false, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 250, price: 399, stock: 60 }] },
        { name: 'Mahabhringraj Ayurvedic Hair Growth Oil', slug: 'mahabhringraj-ayurvedic-oil', category: oilsCat._id, description: 'Traditional sesame oil infusion with 15 potent herbal extracts for deep root nourishment and dense hair growth.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 100, price: 299, stock: 50 }, { grams: 200, price: 549, stock: 30 }] },
        { name: 'Cold-Pressed Virgin Rosemary & Coconut Oil', slug: 'rosemary-virgin-coconut-oil', category: oilsCat._id, description: 'Pure rosemary essential oil blended with unrefined virgin coconut oil for anti-thinning scalp massage.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 150, price: 399, stock: 40 }, { grams: 300, price: 699, stock: 20 }] },
        { name: 'Black Seed & Castor Intensive Scalp Treatment', slug: 'black-seed-castor-oil', category: oilsCat._id, description: 'Rich kalonji (black seed) and Jamaican black castor oil elixir to seal moisture and prevent split ends.', isFeatured: false, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 100, price: 350, stock: 35 }] },
        { name: 'Handcrafted Botanical Cotton Maxi Dress', slug: 'botanical-cotton-maxi-dress', category: dressesCat._id, description: 'Breathable 100% organic cotton maxi dress featuring subtle herbal leaf block prints and flared silhouette.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 350, price: 1499, stock: 15 }, { grams: 400, price: 1799, stock: 10 }] },
        { name: 'Floral Chiffon Summer Sundress', slug: 'floral-chiffon-summer-sundress', category: dressesCat._id, description: 'Lightweight pastel floral print dress with adjustable waist tie and ruffle tiered skirt.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 300, price: 1299, stock: 20 }] },
        { name: 'Handloom Khadi Linen Shift Dress', slug: 'handloom-khadi-linen-dress', category: dressesCat._id, description: 'Eco-friendly handwoven khadi linen dress with wooden button accents and side pockets.', isFeatured: false, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 450, price: 1699, stock: 12 }] },
        { name: 'Embroidered Silk Blend Evening Gown', slug: 'embroidered-silk-blend-gown', category: dressesCat._id, description: 'Luxurious silk blend gown detailed with intricate zari embroidery on neckline and cuffs.', isFeatured: true, isAvailable: true, images: ['/images/hero-banner.jpg'], variants: [{ grams: 500, price: 2499, stock: 8 }] }
      ]);
      console.log('[Auto-Seed] Successfully seeded 12 products and accounts!');
    }
  } catch (err) {
    console.warn('[Auto-Seed Note]:', err.message);
  }
};

// @desc    Get all products (with search, category, sort, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    await seedIfNeeded();
    const queryObj = {};

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

    await product.deleteOne();

    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    const review = {
      user: req.user.id,
      name: req.user.username,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};
