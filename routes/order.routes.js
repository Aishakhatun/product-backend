const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect); // All order routes require authentication

router.route('/')
  .post(createOrder)
  .get(authorize('admin'), getOrders);

router.route('/my-orders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById)
  .delete(authorize('admin'), deleteOrder);

router.route('/:id/status')
  .put(authorize('admin'), updateOrderStatus);

module.exports = router;
