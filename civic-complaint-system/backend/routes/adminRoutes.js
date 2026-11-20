const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// All admin routes require admin role
router.use(authenticateToken, authorizeRoles('admin'));

router.get('/complaints', adminController.getAllComplaints);
router.patch('/complaints/:id/triage', adminController.triageComplaint);
router.get('/directory', adminController.getDepartmentsAndStaff);

module.exports = router;
