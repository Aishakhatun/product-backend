const express = require('express');
const { submitContact, getContacts } = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .post(submitContact)
  .get(protect, authorize('admin'), getContacts);

module.exports = router;
