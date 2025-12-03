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
      menu_sets,
      specialRequest,
      deposit_required
    } = req.body;

    // ตรวจสอบ Package
    const menuPackage = await MenuPackageModel.findById(packageId);
    if (!menuPackage) {
      return res.status(404).json({ message: "Menu package not found" });
    }

    // แปลง Decimal128 → Number
    const price = parseFloat(menuPackage.price.toString());

    // คำนวณราคา
    const totalPrice = new mongoose.Types.Decimal128((price * table_count).toString());
    const pricePerTable = new mongoose.Types.Decimal128(price.toString());

    // ถ้าไม่ส่ง deposit_required → default = 30%
    const depositRequired = deposit_required
      ? new mongoose.Types.Decimal128(deposit_required.toString())
      : new mongoose.Types.Decimal128((price * table_count * 0.30).toString());

    // Generate booking code
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    const bookingCode = `BK-${year}${month}${day}${randomNum}`;

    const booking = await BookingModel.create({
      customer: {
        customerID: customerInfo.customerID,
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email
      },
      package: {
        packageID: menuPackage._id,
        package_name: menuPackage.name,
        price_per_table: pricePerTable
      },
      event_datetime,
      table_count,
      location,
      menu_sets: menu_sets || [],
      specialRequest: specialRequest || "",
      deposit_required: depositRequired,
      total_price: totalPrice,
      booking_date: new Date(),
      bookingCode: bookingCode
    });

    res.status(201).json({
      message: "Booking created successfully",
      data: booking
    });
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
    const { status, amount, slip_image, payment_type } = req.body;
    const booking = await BookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // อัปเดตสถานะหลัก
    booking.payment_status = status;

    // ถ้ามีการชำระเงิน → push ลง payments[]
    if (amount) {
      booking.payments.push({
        payment_date: new Date(),
        amount: new mongoose.Types.Decimal128(amount.toString()),
        payment_type: payment_type || "deposit",
        slip_image: slip_image || null
      });
    }

    await booking.save();

    res.status(200).json({
      message: "Booking status updated successfully",
      data: booking
    });

  } catch (error) {
    console.error("updateBookingStatus Error:", error);
    res.status(500).json({ message: error.message });
  }
};
