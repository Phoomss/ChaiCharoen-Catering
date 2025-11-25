const BookingModel = require("../models/bookingModel");
const MenuPackageModel = require("../models/setPackageModel");

// สร้าง Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      bookingCode,
      customer,
      eventDate,
      eventTime,
      venue,
      contactPhone,
      tableCount,
      menuPackage: packageId,
      selectedMenus = [],
      specialRequest,
    } = req.body;

    // ตรวจสอบ package
    const menuPackage = await MenuPackageModel.findById(packageId).populate("menus");
    if (!menuPackage) {
      return res.status(404).json({ message: "Menu package not found" });
    }

    // คำนวณเมนูเกิน
    const extraCount = Math.max(0, selectedMenus.length - menuPackage.maxSelect);
    const extraCost = extraCount * menuPackage.extraMenuPrice * tableCount;
    const totalPrice = tableCount * menuPackage.price + extraCost;

    const booking = await BookingModel.create({
      bookingCode,
      customer,
      eventDate,
      eventTime,
      venue,
      contactPhone,
      tableCount,
      menuPackage: packageId,
      selectedMenus,
      extraMenuCount: extraCount,
      extraMenuCost: extraCost,
      packagePrice: menuPackage.price,
      totalPrice,
      specialRequest,
      status: "pending",
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
      .populate("customer", "name email phone")
      .populate("menuPackage")
      .populate("selectedMenus");

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
      .populate("customer", "name email phone")
      .populate("menuPackage")
      .populate("selectedMenus");

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

    booking.status = status;
    booking.statusLogs.push({ status, message });
    await booking.save();

    res.status(200).json({ message: "Booking status updated", data: booking });
  } catch (error) {
    console.error("updateBookingStatus Error:", error);
    res.status(500).json({ message: error.message });
  }
};
