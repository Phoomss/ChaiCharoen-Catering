const mongoose = require("mongoose");

const menuPackageSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,  // เช่น 1800, 2000, 3500
      unique: true,
    },

    // รายการเมนูทั้งหมดที่ package นี้ "รวมถึง"
    menus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
    ],

    // จำนวนเมนูที่ลูกค้าเลือกได้ (default = 8)
    maxSelect: {
      type: Number,
      default: 8,
    },

    // ถ้าเลือกเกินให้คิดราคาเพิ่มเมนูละกี่บาท
    extraMenuPrice: {
      type: Number,
      default: 200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuPackage", menuPackageSchema);
