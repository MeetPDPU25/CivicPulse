const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Staff routes require staff or admin role
router.use(authenticateToken, authorizeRoles('staff', 'admin'));

router.get('/tasks', staffController.getAssignedTasks);
router.patch('/tasks/:id/progress', staffController.updateTaskProgress);
router.post('/tasks/:id/resolve', upload.single('resolution_image'), staffController.resolveTask);

module.exports = router;
