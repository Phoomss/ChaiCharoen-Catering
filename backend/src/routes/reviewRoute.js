const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// สร้าง Review และ ดึง Review ทั้งหมด
router.route("/")
  .post(reviewController.createReview)
  .get(reviewController.getAllReviews);

// ดึง Review ตาม ID, อัปเดต และ ลบ
router.route("/:id")
  .get(reviewController.getReviewById)
  .put(reviewController.updateReview)
  .delete(reviewController.deleteReview);

// ดึง Review ตาม Customer
router.get("/customer/:customerID", reviewController.getReviewsByCustomer);

// ดึง Review ตาม Booking
router.get("/booking/:bookingID", reviewController.getReviewsByBooking);

// ดึงค่าเฉลี่ยของ Rating
router.get("/average-rating", reviewController.getAverageRating);

module.exports = router;