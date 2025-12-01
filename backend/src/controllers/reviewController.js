const ReviewModel = require("../models/reviewModel");
const BookingModel = require("../models/bookingModel");
const UserModel = require("../models/userModel");

exports.createReview = async (req, res) => {
  try {
    const { customerID, bookingID, rating, review_text } = req.body;

    const booking = await BookingModel.findById(bookingID).populate('customer.customerID');
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customer.customerID.toString() !== customerID.toString()) {
      return res.status(403).json({ message: "You are not authorized to review this booking" });
    }

    const existingReview = await ReviewModel.findOne({ bookingID });
    if (existingReview) {
      return res.status(400).json({ message: "Review for this booking already exists" });
    }

    const review = await ReviewModel.create({
      customerID,
      bookingID,
      rating,
      review_text
    });

    res.status(201).json({ message: "Review created successfully", data: review });
  } catch (error) {
    console.error("createReview Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { rating, bookingID, customerID, search } = req.query;

    let filter = {};

    if (rating) {
      filter.rating = rating;
    }

    if (bookingID) {
      filter.bookingID = bookingID;
    }

    if (customerID) {
      filter.customerID = customerID;
    }

    // ค้นหาจาก review_text 
    if (search) {
      filter.review_text = { $regex: search, $options: "i" };
    }

    const reviews = await ReviewModel.find(filter)
      .populate("customerID", "name email phone")
      .populate("bookingID", "bookingCode event_datetime table_count total_price")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: reviews.length, data: reviews });
  } catch (error) {
    console.error("getAllReviews Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id)
      .populate("customerID", "name email phone")
      .populate("bookingID", "bookingCode event_datetime table_count total_price");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("getReviewById Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, review_text } = req.body;
    const reviewId = req.params.id;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { rating, review_text },
      { new: true, runValidators: true }
    )
    .populate("customerID", "name email phone")
    .populate("bookingID", "bookingCode event_datetime table_count total_price");

    res.status(200).json({ message: "Review updated successfully", data: updatedReview });
  } catch (error) {
    console.error("updateReview Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await ReviewModel.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("deleteReview Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByCustomer = async (req, res) => {
  try {
    const { customerID } = req.params;

    const reviews = await ReviewModel.find({ customerID })
      .populate("customerID", "name email phone")
      .populate("bookingID", "bookingCode event_datetime table_count total_price")
      .sort({ createdAt: -1 });

    res.status(200).json({ count: reviews.length, data: reviews });
  } catch (error) {
    console.error("getReviewsByCustomer Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewsByBooking = async (req, res) => {
  try {
    const { bookingID } = req.params;

    const review = await ReviewModel.findOne({ bookingID })
      .populate("customerID", "name email phone")
      .populate("bookingID", "bookingCode event_datetime table_count total_price");

    if (!review) {
      return res.status(404).json({ message: "No review found for this booking" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("getReviewsByBooking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const result = await ReviewModel.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }

    res.status(200).json({
      averageRating: Math.round(result[0].averageRating * 100) / 100,
      totalReviews: result[0].totalReviews
    });
  } catch (error) {
    console.error("getAverageRating Error:", error);
    res.status(500).json({ message: error.message });
  }
};