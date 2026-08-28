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

const categoriesData = [
  { name: 'Shampoos', slug: 'shampoos', description: 'Organic botanical & herbal shampoos' },
  { name: 'Hair Oils', slug: 'hair-oils', description: 'Nourishing botanical hair oils' },
  { name: 'Dresses', slug: 'dresses', description: 'Elegant handcrafted organic dresses' },
  { name: 'Accessories', slug: 'accessories', description: 'Handcrafted wellness & lifestyle accessories' },
];

const productsData = [
  // 5 Shampoos
  {
    name: 'Herbal Essence Nourishing Shampoo',
    slug: 'herbal-essence-nourishing-shampoo',
    categorySlug: 'shampoos',
    description: 'Enriched with organic aloe vera, neem, and bhringraj extracts to strengthen roots and restore natural shine.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 200, price: 349, stock: 45 },
      { grams: 500, price: 699, stock: 30 }
    ]
  },
  {
    name: 'Onion & Red Clover Anti-Hairfall Shampoo',
    slug: 'onion-red-clover-shampoo',
    categorySlug: 'shampoos',
    description: 'Potent formula with cold-pressed red onion seed oil to reduce hair breakage and stimulate follicle regrowth.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 250, price: 425, stock: 50 },
      { grams: 500, price: 799, stock: 25 }
    ]
  },
  {
    name: 'Tea Tree Purifying Anti-Dandruff Shampoo',
    slug: 'tea-tree-anti-dandruff-shampoo',
    categorySlug: 'shampoos',
    description: 'Infused with Australian tea tree oil and salicylic acid to gently cleanse flakes and soothe itchy scalp.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 200, price: 380, stock: 40 },
      { grams: 400, price: 650, stock: 20 }
    ]
  },
  {
    name: 'Argan Oil Deep Moisture Cleanser',
    slug: 'argan-oil-moisture-shampoo',
    categorySlug: 'shampoos',
    description: 'Moroccan argan oil enriched shampoo for frizzy, dry, or chemically treated hair seeking silky smoothness.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 300, price: 499, stock: 35 },
      { grams: 600, price: 899, stock: 15 }
    ]
  },
  {
    name: 'Hibiscus & Coconut Volumizing Cleanser',
    slug: 'hibiscus-coconut-volumizing-shampoo',
    categorySlug: 'shampoos',
    description: 'Lightweight botanical cleanser with Hibiscus flower extract to add bounce, body, and volume.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 250, price: 399, stock: 60 }
    ]
  },

  // 2 Hair Oils
  {
    name: 'Mahabhringraj Ayurvedic Hair Growth Oil',
    slug: 'mahabhringraj-ayurvedic-oil',
    categorySlug: 'hair-oils',
    description: 'Traditional sesame oil infusion with 15 potent herbal extracts for deep root nourishment and dense hair growth.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 100, price: 299, stock: 50 },
      { grams: 200, price: 549, stock: 30 }
    ]
  },
  {
    name: 'Cold-Pressed Virgin Rosemary & Coconut Oil',
    slug: 'rosemary-virgin-coconut-oil',
    categorySlug: 'hair-oils',
    description: 'Pure rosemary essential oil blended with unrefined virgin coconut oil for anti-thinning scalp massage.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 150, price: 399, stock: 40 },
      { grams: 300, price: 699, stock: 20 }
    ]
  },

  // 4 Dresses
  {
    name: 'Handcrafted Botanical Cotton Maxi Dress',
    slug: 'botanical-cotton-maxi-dress',
    categorySlug: 'dresses',
    description: 'Breathable 100% organic cotton maxi dress featuring subtle herbal leaf block prints and flared silhouette.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 350, price: 1499, stock: 15 },
      { grams: 400, price: 1799, stock: 10 }
    ]
  },
  {
    name: 'Floral Chiffon Summer Sundress',
    slug: 'floral-chiffon-summer-sundress',
    categorySlug: 'dresses',
    description: 'Lightweight pastel floral print dress with adjustable waist tie and ruffle tiered skirt.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 300, price: 1299, stock: 20 }
    ]
  },
  {
    name: 'Handloom Khadi Linen Shift Dress',
    slug: 'handloom-khadi-linen-dress',
    categorySlug: 'dresses',
    description: 'Eco-friendly handwoven khadi linen dress with wooden button accents and side pockets.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 450, price: 1699, stock: 12 }
    ]
  },
  {
    name: 'Embroidered Silk Blend Evening Gown',
    slug: 'embroidered-silk-blend-gown',
    categorySlug: 'dresses',
    description: 'Luxurious silk blend gown detailed with intricate zari embroidery on neckline and cuffs.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [
      { grams: 500, price: 2499, stock: 8 }
    ]
  },

  // 10 Accessories
  {
    name: 'Handmade Neem Wood Wide-Tooth Comb',
    slug: 'handmade-neem-wood-comb',
    categorySlug: 'accessories',
    description: 'Anti-static, anti-bacterial medicinal neem wood comb that gently detangles hair and prevents breakage.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 80, price: 199, stock: 100 }]
  },
  {
    name: 'Mulberry Silk Hair Scrunchies Set (Pack of 3)',
    slug: 'mulberry-silk-hair-scrunchies',
    categorySlug: 'accessories',
    description: '100% Pure Mulberry Silk scrunchies designed to glide over hair without snagging, creasing, or tearing.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 60, price: 399, stock: 80 }]
  },
  {
    name: 'Eco-Friendly Jute Tote Shopping Bag',
    slug: 'jute-tote-shopping-bag',
    categorySlug: 'accessories',
    description: 'Durable, biodegradable natural jute tote featuring reinforced cotton handles and spacious interior.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 250, price: 299, stock: 50 }]
  },
  {
    name: 'Organic Cotton Headband & Hair Wrap',
    slug: 'organic-cotton-headband-wrap',
    categorySlug: 'accessories',
    description: 'Soft stretch organic cotton headband ideal for skincare routines, yoga, or everyday casual styling.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 50, price: 249, stock: 65 }]
  },
  {
    name: 'Bamboo Fibre Scalp Massager & Shampoo Brush',
    slug: 'bamboo-scalp-massager-brush',
    categorySlug: 'accessories',
    description: 'Ergonomic eco-bamboo body with soft silicone bristles to stimulate microcirculation during shampooing.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 90, price: 349, stock: 75 }]
  },
  {
    name: 'Hand-Drawn Velvet Cosmetic Pouch',
    slug: 'velvet-cosmetic-pouch',
    categorySlug: 'accessories',
    description: 'Plush velvet makeup travel pouch with gold metallic zipper and water-resistant inner lining.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 120, price: 449, stock: 45 }]
  },
  {
    name: 'Natural Jade Roller & Gua Sha Facial Set',
    slug: 'natural-jade-roller-gua-sha',
    categorySlug: 'accessories',
    description: 'Authentic Xiuyan green jade stone roller and heart-shaped gua sha tool to boost collagen and lymphatic drainage.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 180, price: 699, stock: 30 }]
  },
  {
    name: 'Handwoven Rattan Straw Beach Handbag',
    slug: 'rattan-straw-beach-handbag',
    categorySlug: 'accessories',
    description: 'Artisanal handwoven round rattan bag with genuine leather shoulder strap and linen lining.',
    isFeatured: true,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 350, price: 899, stock: 20 }]
  },
  {
    name: 'Pearl & Gold Plated Minimalist Hair Pins',
    slug: 'pearl-gold-hair-pins',
    categorySlug: 'accessories',
    description: 'Set of 4 elegant freshwater pearl hair bobby pins for bridal, festive, or elevated daily hairstyles.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 40, price: 299, stock: 90 }]
  },
  {
    name: 'Organic Cotton Microfiber Hair Drying Towel Wrap',
    slug: 'microfiber-hair-towel-wrap',
    categorySlug: 'accessories',
    description: 'Super absorbent waffle weave cotton hair turban wrap with secure button loop for fast frizz-free drying.',
    isFeatured: false,
    isAvailable: true,
    images: ['/images/hero-banner.jpg'],
    variants: [{ grams: 140, price: 329, stock: 60 }]
  }
];

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    
    try {
      await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
      console.log('MongoDB Atlas Database connected!');
    } catch (primaryErr) {
      console.log('Primary DB Note:', primaryErr.message);
      console.log('Connecting to local fallback database...');
      await mongoose.connect('mongodb://127.0.0.1:27017/aishahub');
      console.log('Local Fallback Database connected!');
    }

    // 1. Clear database
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 2. Create Users
    console.log('Creating admin & user accounts...');
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

    // 3. Create Categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach(c => { categoryMap[c.slug] = c._id; });

    // 4. Create Products
    console.log('Creating products...');
    const formattedProducts = productsData.map(p => ({
      ...p,
      category: categoryMap[p.categorySlug]
    }));
    await Product.insertMany(formattedProducts);

    console.log('✅ Seeding Complete!');
    console.log(`- Admin: admin@gmail.com / admin123`);
    console.log(`- User: user@gmail.com / user123`);
    console.log(`- Categories: ${createdCategories.length}`);
    console.log(`- Products: ${formattedProducts.length} (5 Shampoos, 2 Oils, 4 Dresses, 10 Accessories)`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
