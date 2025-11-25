const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventTime: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    contactPhone: {
      type: String,
      required: true,
    },

    tableCount: {
      type: Number,
      required: true,
      min: 1,
    },

    // ----------------------------
    // 📌 เลือกแพ็กเกจ เช่น 1800, 2000, 3500
    // ----------------------------
    menuPackage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuPackage",
      required: true,
    },

    // ----------------------------
    // 📌 เมนูที่ลูกค้าเลือกจริง (IDs)
    // ----------------------------
    selectedMenus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

    // ----------------------------
    // 📌 จำนวนเมนูเกินที่คิดเพิ่ม
    // เช่น maxSelect = 8 แต่เลือก 10 → extraCount = 2
    // ----------------------------
    extraMenuCount: {
      type: Number,
      default: 0,
    },

    // ----------------------------
    // 📌 ราคาเพิ่มรวมของเมนูเกิน
    // extraMenuCount * extraPrice * tableCount
    // ----------------------------
    extraMenuCost: {
      type: Number,
      default: 0,
    },

    // ----------------------------
    // 📌 ราคาต่อโต๊ะของแพ็กเกจ (เผื่อมีการแก้ราคาในอนาคต)
    // ----------------------------
    packagePrice: {
      type: Number,
      required: true,
    },

    // ----------------------------
    // 📌 ราคารวมทั้งหมดของงานนี้
    // (tableCount * packagePrice) + extraMenuCost
    // ----------------------------
    totalPrice: {
      type: Number,
      default: 0,
    },

    specialRequest: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",        // จองใหม่
        "confirmed",      // ร้านคอนเฟิร์มแล้ว
        "deposit-paid",   // จ่ายมัดจำแล้ว
        "completed",      // งานจบ
        "cancelled",
      ],
      default: "pending",
    },

    // ----------------------------
    // 📌 ประวัติการเปลี่ยนสถานะ (Activity log)
    // ----------------------------
    statusLogs: [
      {
        status: String,
        message: String,
        updatedAt: { type: Date, default: Date.now },
      },
    ],

    // ----------------------------
    // 📌 ส่วนการชำระเงิน
    // ----------------------------
    payment: {
      depositAmount: { type: Number, default: 0 },   // มัดจำที่ต้องจ่าย
      depositPaid: { type: Boolean, default: false },
      paidAt: { type: Date, default: null },
      slipImage: { type: String, default: "" },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
