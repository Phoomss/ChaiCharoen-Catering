const bookingModel = require('../models/bookingModel');
const userModel = require('../models/userModel');

// Get customer dashboard summary
const getCustomerDashboardSummary = async (req, res) => {
    try {
        const customerId = req.user._id;
        
        // Get customer profile info
        const customer = await userModel.findById(customerId).select("-password");
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Get customer's booking count
        const bookingCount = await bookingModel.countDocuments({ 'customer.customerID': customerId });
        
        // Get customer's recent bookings (up to 5)
        const recentBookings = await bookingModel.find({ 'customer.customerID': customerId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('package.package_name event_datetime table_count payment_status total_price');

        // Calculate total spending
        const totalSpending = await bookingModel.aggregate([
            { $match: { 'customer.customerID': customerId } },
            { $group: { _id: null, total: { $sum: '$total_price' } } }
        ]);

        const totalSpent = totalSpending.length > 0 ? totalSpending[0].total : 0;

        // Get upcoming booking (if any)
        const upcomingBooking = await bookingModel.findOne({
            'customer.customerID': customerId,
            event_datetime: { $gte: new Date() }
        }).sort({ event_datetime: 1 });

        res.status(200).json({
            data: {
                customer: {
                    name: `${customer.title} ${customer.firstName} ${customer.lastName}`,
                    email: customer.email,
                    phone: customer.phone
                },
                stats: {
                    totalBookings: bookingCount,
                    totalSpent: totalSpent,
                    upcomingBooking: upcomingBooking ? {
                        date: upcomingBooking.event_datetime,
                        packageName: upcomingBooking.package.package_name,
                        tableCount: upcomingBooking.table_count
                    } : null
                },
                recentBookings: recentBookings
            }
        });

    } catch (error) {
        console.error("getCustomerDashboardSummary Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get customer's bookings
const getCustomerBookings = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { status } = req.query;

        let query = { 'customer.customerID': customerId };
        
        if (status) {
            query.payment_status = status;
        }

        const bookings = await bookingModel.find(query)
            .sort({ createdAt: -1 })
            // .select('package.package_name event_datetime table_count payment_status total_price createdAt');

        res.status(200).json({ data: bookings });

    } catch (error) {
        console.error("getCustomerBookings Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get customer profile
const getCustomerProfile = async (req, res) => {
    try {
        const customerId = req.user._id;
        
        const customer = await userModel.findById(customerId).select("-password");
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({ data: customer });

    } catch (error) {
        console.error("getCustomerProfile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update customer profile
const updateCustomerProfile = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { title, firstName, lastName, username, email, phone, address } = req.body;

        // Check if new email/username/phone already exists for another user
        const existingUser = await userModel.findOne({
            $or: [
                username ? { username } : null,
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean),
            _id: { $ne: customerId }
        });

        if (existingUser) {
            return res.status(400).json({
                message:
                    existingUser.username === username
                        ? "Username นี้ถูกใช้งานแล้ว"
                        : existingUser.email === email
                            ? "อีเมลนี้ถูกใช้งานแล้ว"
                        : "เบอร์โทรนี้ถูกใช้งานแล้ว"
            });
        }

        const updatedCustomer = await userModel.findByIdAndUpdate(
            customerId,
            { title, firstName, lastName, username, email, phone, address },
            { new: true, select: "-password" }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json({
            message: "อัปเดตโปรไฟล์สำเร็จ",
            data: updatedCustomer
        });

    } catch (error) {
        console.error("updateCustomerProfile Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Cancel customer's booking
const cancelCustomerBooking = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { id } = req.params;

        // Find the booking that belongs to the customer
        const booking = await bookingModel.findOne({
            _id: id,
            'customer.customerID': customerId
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found or does not belong to customer" });
        }

        // Check if the booking can be cancelled (only allow cancellation if status is pending-deposit)
        if (booking.payment_status !== 'pending-deposit') {
            return res.status(400).json({
                message: `Cannot cancel booking with status: ${booking.payment_status}. Only pending bookings can be cancelled.`
            });
        }

        // Update booking status to cancelled
        booking.payment_status = 'cancelled';
        await booking.save();

        // Optionally, you could add a cancellation record or note here

        res.status(200).json({
            message: "Booking cancelled successfully",
            data: booking
        });

    } catch (error) {
        console.error("cancelCustomerBooking Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getCustomerDashboardSummary,
    getCustomerBookings,
    getCustomerProfile,
    updateCustomerProfile,
    cancelCustomerBooking
};