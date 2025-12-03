const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const customerController = require("../controllers/customerController");

// Utility: async wrapper
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* ===========================
    CUSTOMER DASHBOARD — Auth required
=========================== */

// GET: customer dashboard summary
router.get('/dashboard', authenticateToken, asyncHandler(customerController.getCustomerDashboardSummary));

// GET: customer bookings
router.get('/bookings', authenticateToken, asyncHandler(customerController.getCustomerBookings));

// GET: customer profile
router.get('/profile', authenticateToken, asyncHandler(customerController.getCustomerProfile));

// PUT: update customer profile
router.put('/profile', authenticateToken, asyncHandler(customerController.updateCustomerProfile));

// DELETE: cancel customer booking
router.delete('/booking/:id', authenticateToken, asyncHandler(customerController.cancelCustomerBooking));

module.exports = router;