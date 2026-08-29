const Order = require('../models/order.model');
const Product = require('../models/product.model');
const nodemailer = require('nodemailer');

// Helper to send order email confirmation to Customer & Admin
const sendOrderEmail = async (order, userEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'aishasabugar1@gmail.com',
        pass: process.env.SMTP_PASS || 'agglqqauzfwapqax',
      },
    });

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e7e5e4;">${item.name} (${item.grams}g)</td>
        <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e7e5e4; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    const customerEmail = userEmail || order.billingDetails?.email || 'aishasabugar1@gmail.com';
    const adminEmail = process.env.ADMIN_CONTACT_EMAIL || 'aishasabugar1@gmail.com';
    
    const PAYMENT_MAP = {
      cod: 'Cash on Delivery (COD)',
      gpay: 'Google Pay (UPI: aishasabugar11@ibl)',
      phonepe: 'PhonePe (UPI: aishasabugar11@ibl)',
      paytm: 'Paytm (UPI: aishasabugar11@ibl)',
      upi: 'UPI Direct (aishasabugar11@ibl)',
      online: 'Credit / Debit Card',
      card: 'Credit / Debit Card'
    };
    const paymentMethodTitle = PAYMENT_MAP[order.paymentMethod] || order.paymentMethod;

    // 1. Customer Email
    const customerMailOptions = {
      from: `"Aisha Hub Store" <${process.env.SMTP_USER || 'aishasabugar1@gmail.com'}>`,
      to: customerEmail,
      subject: `🎉 Order Placed Successfully #${order._id.toString().slice(-6).toUpperCase()} - Aisha Hub`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1c1917; max-width: 600px; margin: 0 auto; border: 1px solid #e7e5e4; border-radius: 12px; background: #ffffff;">
          <h2 style="color: #064e3b; margin-top: 0;">🎉 Order Placed Successfully!</h2>
          <p>Hi <strong>${order.billingDetails?.fullName || 'Valued Customer'}</strong>,</p>
          <p>Thank you for shopping with Aisha Hub! Your order has been placed successfully and is being processed.</p>
          
          <div style="background: #f4fbf7; border: 1px solid #a7f3d0; border-radius: 8px; padding: 14px; margin: 18px 0;">
            <p style="margin: 0 0 6px;"><strong>Order ID:</strong> #${order._id}</p>
            <p style="margin: 0 0 6px;"><strong>Payment Method:</strong> ${paymentMethodTitle}</p>
            <p style="margin: 0;"><strong>Payment Status:</strong> <span style="color: #047857; font-weight: bold; text-transform: uppercase;">${order.paymentStatus}</span></p>
          </div>

          <h3 style="color: #064e3b;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #f5f5f4; text-align: left;">
                <th style="padding: 10px;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="text-align: right; border-top: 2px solid #e7e5e4; padding-top: 10px; font-size: 1.1rem; font-weight: bold; color: #064e3b;">
            Total Amount: ₹${order.totalAmount}
          </div>

          <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 20px 0;" />

          <p style="margin-bottom: 4px;"><strong>Delivery Address:</strong></p>
          <p style="color: #44403c; margin-top: 0;">
            ${order.billingDetails?.streetAddress || ''}, ${order.billingDetails?.city || ''}, ${order.billingDetails?.state || ''} ${order.billingDetails?.pincode || ''}<br/>
            Phone: ${order.billingDetails?.phone || ''}
          </p>

          <p style="font-size: 0.82rem; color: #78716c; margin-top: 24px; text-align: center;">
            Need help with your order? Reply to this email or visit Aisha Hub.
          </p>
        </div>
      `,
    };

    // 2. Admin Email Alert
    const adminMailOptions = {
      from: `"Aisha Hub System" <${process.env.SMTP_USER || 'aishasabugar1@gmail.com'}>`,
      to: adminEmail,
      subject: `🚨 New Order Alert #${order._id.toString().slice(-6).toUpperCase()} - ₹${order.totalAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1c1917; max-width: 600px; margin: 0 auto; border: 1px solid #e7e5e4; border-radius: 8px;">
          <h2 style="color: #064e3b; margin-top: 0;">🛒 New Order Received!</h2>
          <p><strong>Customer:</strong> ${order.billingDetails?.fullName} (${customerEmail})</p>
          <p><strong>Phone:</strong> ${order.billingDetails?.phone}</p>
          <p><strong>Payment Method:</strong> ${paymentMethodTitle}</p>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          <p><strong>Address:</strong> ${order.billingDetails?.streetAddress}, ${order.billingDetails?.city}, ${order.billingDetails?.state} ${order.billingDetails?.pincode}</p>
          <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 15px 0;" />
          <h3>Items:</h3>
          <ul>
            ${order.items.map(i => `<li>${i.name} (${i.grams}g) x ${i.quantity} = ₹${i.price * i.quantity}</li>`).join('')}
          </ul>
        </div>
      `,
    };

    transporter.sendMail(customerMailOptions, (err) => {
      if (err) console.log('[Customer Order Email Note]:', err.message);
      else console.log('[Customer Order Email Sent Successfully]');
    });

    if (adminEmail !== customerEmail) {
      transporter.sendMail(adminMailOptions, (err) => {
        if (err) console.log('[Admin Order Email Note]:', err.message);
        else console.log('[Admin Order Email Sent Successfully]');
      });
    }
  } catch (err) {
    console.log('[Order Email Notification Exception Note]:', err.message);
  }
};

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

    const isPaid = paymentMethod !== 'cod';
    const orderPaymentDetails = {
      transactionId: isPaid ? (paymentDetails?.transactionId || `TXN_${Date.now()}`) : undefined,
      paymentGateway: isPaid ? (paymentDetails?.paymentGateway || (paymentMethod.toUpperCase() + ' (aishasabugar11@ibl)')) : undefined,
      paidAt: isPaid ? new Date() : undefined,
    };

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      billingDetails,
      paymentMethod,
      paymentStatus: isPaid ? 'paid' : 'pending',
      orderStatus: 'pending',
      shippingFee,
      codFee,
      totalAmount,
      paymentDetails: orderPaymentDetails,
    });

    // Send confirmation email asynchronously
    sendOrderEmail(order, req.user?.email || billingDetails?.email);

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
