const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authenticateToken = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Utility: async wrapper
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// POST: create booking (available to customers)
router.post("/", authenticateToken, asyncHandler(bookingController.createBooking));

// GET: all bookings (admin only)
router.get("/", authenticateToken, adminAuth, asyncHandler(bookingController.getAllBookings));

// GET: booking by ID (admin only)
router.get("/:id", authenticateToken, adminAuth, asyncHandler(bookingController.getBookingById));

// PUT: update booking status (admin only)
router.put("/:id/status", authenticateToken, adminAuth, asyncHandler(bookingController.updateBookingStatus));

module.exports = router;