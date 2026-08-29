const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Helper to auto-seed 21 products across 4 categories + admin/user if database is empty
const seedIfNeeded = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Auto-Seed] Database empty. Pre-populating 21 products across 4 categories...');
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

      let accCat = await Category.findOne({ slug: 'accessories' });
      if (!accCat) accCat = await Category.create({ name: 'Accessories', slug: 'accessories', description: 'Handcrafted wellness & lifestyle accessories' });

      await Product.insertMany([
        // 5 Shampoos
        { name: 'Herbal Essence Nourishing Shampoo', slug: 'herbal-essence-nourishing-shampoo', category: shampoosCat._id, description: 'Enriched with organic aloe vera, neem, and bhringraj extracts to strengthen roots and restore natural shine.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 200, price: 349, stock: 45 }, { grams: 500, price: 699, stock: 30 }] },
        { name: 'Onion & Red Clover Anti-Hairfall Shampoo', slug: 'onion-red-clover-shampoo', category: shampoosCat._id, description: 'Potent formula with cold-pressed red onion seed oil to reduce hair breakage and stimulate follicle regrowth.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 250, price: 425, stock: 50 }, { grams: 500, price: 799, stock: 25 }] },
        { name: 'Tea Tree Purifying Anti-Dandruff Shampoo', slug: 'tea-tree-anti-dandruff-shampoo', category: shampoosCat._id, description: 'Infused with Australian tea tree oil and salicylic acid to gently cleanse flakes and soothe itchy scalp.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 200, price: 380, stock: 40 }, { grams: 400, price: 650, stock: 20 }] },
        { name: 'Argan Oil Deep Moisture Cleanser', slug: 'argan-oil-moisture-shampoo', category: shampoosCat._id, description: 'Moroccan argan oil enriched shampoo for frizzy, dry, or chemically treated hair seeking silky smoothness.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1608248597263-00079e9624b4?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 300, price: 499, stock: 35 }, { grams: 600, price: 899, stock: 15 }] },
        { name: 'Hibiscus & Coconut Volumizing Cleanser', slug: 'hibiscus-coconut-volumizing-shampoo', category: shampoosCat._id, description: 'Lightweight botanical cleanser with Hibiscus flower extract to add bounce, body, and volume.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 250, price: 399, stock: 60 }] },
        
        // 2 Hair Oils
        { name: 'Mahabhringraj Ayurvedic Hair Growth Oil', slug: 'mahabhringraj-ayurvedic-oil', category: oilsCat._id, description: 'Traditional sesame oil infusion with 15 potent herbal extracts for deep root nourishment and dense hair growth.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 100, price: 299, stock: 50 }, { grams: 200, price: 549, stock: 30 }] },
        { name: 'Cold-Pressed Virgin Rosemary & Coconut Oil', slug: 'rosemary-virgin-coconut-oil', category: oilsCat._id, description: 'Pure rosemary essential oil blended with unrefined virgin coconut oil for anti-thinning scalp massage.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 150, price: 399, stock: 40 }, { grams: 300, price: 699, stock: 20 }] },
        
        // 4 Dresses
        { name: 'Handcrafted Botanical Cotton Maxi Dress', slug: 'botanical-cotton-maxi-dress', category: dressesCat._id, description: 'Breathable 100% organic cotton maxi dress featuring subtle herbal leaf block prints and flared silhouette.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 350, price: 1499, stock: 15 }, { grams: 400, price: 1799, stock: 10 }] },
        { name: 'Floral Chiffon Summer Sundress', slug: 'floral-chiffon-summer-sundress', category: dressesCat._id, description: 'Lightweight pastel floral print dress with adjustable waist tie and ruffle tiered skirt.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 300, price: 1299, stock: 20 }] },
        { name: 'Handloom Khadi Linen Shift Dress', slug: 'handloom-khadi-linen-dress', category: dressesCat._id, description: 'Eco-friendly handwoven khadi linen dress with wooden button accents and side pockets.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 450, price: 1699, stock: 12 }] },
        { name: 'Embroidered Silk Blend Evening Gown', slug: 'embroidered-silk-blend-gown', category: dressesCat._id, description: 'Luxurious silk blend gown detailed with intricate zari embroidery on neckline and cuffs.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 500, price: 2499, stock: 8 }] },

        // 10 Accessories
        { name: 'Handmade Neem Wood Wide-Tooth Comb', slug: 'handmade-neem-wood-comb', category: accCat._id, description: 'Anti-static, anti-bacterial medicinal neem wood comb that gently detangles hair and prevents breakage.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1590159763121-7c9fd312190d?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 80, price: 199, stock: 100 }] },
        { name: 'Mulberry Silk Hair Scrunchies Set (Pack of 3)', slug: 'mulberry-silk-hair-scrunchies', category: accCat._id, description: '100% Pure Mulberry Silk scrunchies designed to glide over hair without snagging, creasing, or tearing.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1631730486784-5456119f69ae?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 60, price: 399, stock: 80 }] },
        { name: 'Eco-Friendly Jute Tote Shopping Bag', slug: 'jute-tote-shopping-bag', category: accCat._id, description: 'Durable, biodegradable natural jute tote featuring reinforced cotton handles and spacious interior.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 250, price: 299, stock: 50 }] },
        { name: 'Organic Cotton Headband & Hair Wrap', slug: 'organic-cotton-headband-wrap', category: accCat._id, description: 'Soft stretch organic cotton headband ideal for skincare routines, yoga, or everyday casual styling.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1584297091622-af8e5fda435a?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 50, price: 249, stock: 65 }] },
        { name: 'Bamboo Fibre Scalp Massager & Shampoo Brush', slug: 'bamboo-scalp-massager-brush', category: accCat._id, description: 'Ergonomic eco-bamboo body with soft silicone bristles to stimulate microcirculation during shampooing.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1519735777090-ec97162dc266?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 90, price: 349, stock: 75 }] },
        { name: 'Hand-Drawn Velvet Cosmetic Pouch', slug: 'velvet-cosmetic-pouch', category: accCat._id, description: 'Plush velvet makeup travel pouch with gold metallic zipper and water-resistant inner lining.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 120, price: 449, stock: 45 }] },
        { name: 'Natural Jade Roller & Gua Sha Facial Set', slug: 'natural-jade-roller-gua-sha', category: accCat._id, description: 'Authentic Xiuyan green jade stone roller and heart-shaped gua sha tool to boost collagen and lymphatic drainage.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 180, price: 699, stock: 30 }] },
        { name: 'Handwoven Rattan Straw Beach Handbag', slug: 'rattan-straw-beach-handbag', category: accCat._id, description: 'Artisanal handwoven round rattan bag with genuine leather shoulder strap and linen lining.', isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 350, price: 899, stock: 20 }] },
        { name: 'Pearl & Gold Plated Minimalist Hair Pins', slug: 'pearl-gold-hair-pins', category: accCat._id, description: 'Set of 4 elegant freshwater pearl hair bobby pins for bridal, festive, or elevated daily hairstyles.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1611591475179-6fe5e7e91d72?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 40, price: 299, stock: 90 }] },
        { name: 'Organic Cotton Microfiber Hair Drying Towel Wrap', slug: 'microfiber-hair-towel-wrap', category: accCat._id, description: 'Super absorbent waffle weave cotton hair turban wrap with secure button loop for fast frizz-free drying.', isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80'], variants: [{ grams: 140, price: 329, stock: 60 }] }
      ]);
      console.log('[Auto-Seed] Successfully seeded 21 products across 4 categories and accounts!');
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
