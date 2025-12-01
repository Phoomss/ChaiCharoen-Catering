const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128; 

const paymentStatusEnums = ['pending-deposit', 'deposit-paid', 'full-payment', 'cancelled'];
const paymentTypeEnums = ['deposit', 'balance', 'full-payment']; // ประเภทการจ่ายใน Array 'payments'

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      customerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    package: {
      packageID: { // อาจใช้ ID อ้างอิงได้ ถ้าต้องการทราบว่าอิงจากแพ็กเกจใด
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuPackage",
        required: true,
      },
      package_name: { type: String, required: true },
      price_per_table: { type: Decimal128, required: true },
    },

    booking_date: {
      type: Date,
      required: true,
      default: Date.now // วันที่ทำการจอง
    },

    event_datetime: {
      type: Date, // วัน/เวลาที่จัดงาน (รวม Date และ Time)
      required: true,
    },

    table_count: {
      type: Number, // จำนวนโต๊ะที่จอง
      required: true,
      min: 1
    },

    location: {
      address: { type: String, required: true },
      latitude: {
        type: Number, 
        required: true,
      },
      longitude: {
        type: Number, 
        required: true,
      },
    },

    payment_status: {
      type: String, // สถานะการชำระเงิน
      required: true,
      enum: paymentStatusEnums,
      default: 'pending-deposit'
    },
    
    total_price: {
      type: Decimal128, // ราคารวมทั้งหมด
      default: 0
    },

    deposit_required: {
      type: Decimal128, // ยอดมัดจำที่ต้องชำระ
      required: true
    },

    menu_sets: [
      {
        menu_name: { type: String, required: true },
        quantity: { type: Number, required: true }
      }
    ],

    payments: [
      {
        payment_date: { type: Date, default: Date.now },
        amount: { type: Decimal128, required: true },
        payment_type: { 
            type: String,
            enum: paymentTypeEnums,
            required: true // มัดจำ, ยอดคงเหลือ
        },
        slip_image: { type: String } // หลักฐานการชำระเงิน
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);