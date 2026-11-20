const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Open / dashboard analytics
router.get('/', analyticsController.getAnalytics);

module.exports = router;
