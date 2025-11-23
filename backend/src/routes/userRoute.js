const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const router = require('express').Router();

// Utility: async wrapper
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* ===========================
    USER (SELF) — Auth required
=========================== */

// GET: my profile
router.get('/me', authenticateToken, asyncHandler(userController.getUserInfo));

// UPDATE: my profile
router.put('/me', authenticateToken, asyncHandler(userController.updateProfile));


/* ===========================
    ADMIN AREA — Should protect with role check
=========================== */

// GET all users
router.get('/all', asyncHandler(userController.getAllUsers));

// Search users by role
router.get('/search', asyncHandler(userController.searchUserByRole));

// Get user by ID
router.get('/:id', asyncHandler(userController.getUserById));

// Update user by ID
router.put('/:id', asyncHandler(userController.updateUser));

// Delete user by ID
router.delete('/:id', asyncHandler(userController.deleteUser));

module.exports = router;
