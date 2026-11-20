const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Create complaint with optional image upload
router.post('/', authenticateToken, upload.single('image'), complaintController.createComplaint);

// Get my complaints
router.get('/my', authenticateToken, complaintController.getMyComplaints);

// Public / Authenticated complaint tracking & details
router.get('/:trackingId', complaintController.getComplaintByTrackingId);

// Citizen verification & rating to close complaint
router.post('/:trackingId/verify', authenticateToken, complaintController.verifyAndCloseComplaint);

module.exports = router;
