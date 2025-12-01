const mongoose = require('mongoose');
const BookingModel = require("../models/bookingModel");
const MenuPackageModel = require("../models/menuPackageModel");

// สร้าง Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      customer: customerInfo,
      packageId,
      event_datetime,
      table_count,
      location,
      specialRequest,
      deposit_required
    } = req.body;

    // ตรวจสอบ package
    const menuPackage = await MenuPackageModel.findById(packageId);
    if (!menuPackage) {
      return res.status(404).json({ message: "Menu package not found" });
    }

    // คำนวณยอดรวมและแปลงเป็น Decimal128
    const totalPrice = new mongoose.Types.Decimal128((menuPackage.price * table_count).toString());
    const pricePerTable = new mongoose.Types.Decimal128(menuPackage.price.toString());
    const depositRequired = deposit_required ?
      new mongoose.Types.Decimal128(deposit_required.toString()) :
      new mongoose.Types.Decimal128((menuPackage.price * 0.3 * table_count).toString()); // 30% as default deposit

    const booking = await BookingModel.create({
      customer: {
        customerID: customerInfo.customerID,
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email
      },
      package: {
        packageID: menuPackage._id,
        package_name: menuPackage.name || `Package ${menuPackage.price}`,
        price_per_table: pricePerTable
      },
      event_datetime,
      table_count,
      location,
      specialRequest: specialRequest || "",
      deposit_required: depositRequired,
      total_price: totalPrice,
      booking_date: new Date()
    });

    res.status(201).json({ message: "Booking created successfully", data: booking });
  } catch (error) {
    console.error("createBooking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ดึง Booking ทั้งหมด
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("customer.customerID", "name email phone")
      .populate("package.packageID");

    res.status(200).json({ data: bookings });
  } catch (error) {
    console.error("getAllBookings Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ดึง Booking ตาม ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id)
      .populate("customer.customerID", "name email phone")
      .populate("package.packageID");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ data: booking });
  } catch (error) {
    console.error("getBookingById Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// อัพเดตสถานะ Booking
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, message } = req.body;
    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.payment_status = status;
    if (status && message) {
      booking.payments = booking.payments || [];
      booking.payments.push({
        payment_date: new Date(),
        amount: booking.deposit_required,
        payment_type: 'deposit',
        slip_image: null
      });
    }
    await booking.save();

    res.status(200).json({ message: "Booking status updated", data: booking });
  } catch (error) {
    console.error("updateBookingStatus Error:", error);
    res.status(500).json({ message: error.message });
  }
};
