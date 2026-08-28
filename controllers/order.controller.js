const Order = require('../models/order.model');
const Product = require('../models/product.model');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, billingDetails, paymentMethod, paymentDetails } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Verify stock and fetch prices dynamically from database to prevent price tampering
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }

      // Find selected variant
      const variant = dbProduct.variants.find((v) => v.grams === Number(item.grams));
      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant ${item.grams}g not found for product ${dbProduct.name}`,
        });
      }

      // Check stock
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${dbProduct.name} (${item.grams}g). Available: ${variant.stock}, Requested: ${item.quantity}`,
        });
      }

      // Deduct stock
      variant.stock -= item.quantity;
      await dbProduct.save();

      // Calculate total
      subtotal += variant.price * item.quantity;

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        grams: variant.grams,
        price: variant.price,
        quantity: item.quantity,
      });
    }

    // Fees calculation
    const shippingFee = subtotal >= 1000 ? 0 : 50; // Free shipping over 1000
    const codFee = paymentMethod === 'cod' ? 50 : 0;
    const totalAmount = subtotal + shippingFee + codFee;

    // Build payment details
    const orderPaymentDetails = {
      transactionId: paymentMethod === 'online' ? (paymentDetails?.transactionId || `TXN_${Date.now()}`) : undefined,
      paymentGateway: paymentMethod === 'online' ? 'Razorpay (Simulation)' : undefined,
      paidAt: paymentMethod === 'online' ? new Date() : undefined,
    };

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      billingDetails,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      orderStatus: 'pending',
      shippingFee,
      codFee,
      totalAmount,
      paymentDetails: orderPaymentDetails,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'username email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only owner or Admin can view order details
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'username email')
      .sort('-createdAt');

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status / payment status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.body.orderStatus) {
      order.orderStatus = req.body.orderStatus;
    }

    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
      if (req.body.paymentStatus === 'paid' && !order.paymentDetails?.paidAt) {
        order.paymentDetails = {
          ...order.paymentDetails,
          paidAt: new Date(),
          transactionId: order.paymentDetails?.transactionId || `TXN_${Date.now()}`,
          paymentGateway: order.paymentDetails?.paymentGateway || 'Admin Override',
        };
      }
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await order.deleteOne();

    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};
