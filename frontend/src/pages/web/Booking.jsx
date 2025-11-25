import React from 'react'

const Booking = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-8">จองโต๊ะจีน</h1>

        <div className="bg-white p-8 rounded-xl shadow-md border border-green-200 mb-8">
          <h2 className="text-2xl font-bold text-green-700 mb-6">ข้อมูลการจอง</h2>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label text-green-700 font-medium">ชื่อ-นามสกุล</label>
                <input
                  type="text"
                  placeholder="กรุณากรอกชื่อ-นามสกุลของคุณ"
                  className="input input-bordered w-full bg-white border-green-200"
                />
              </div>

              <div>
                <label className="label text-green-700 font-medium">เบอร์โทรศัพท์</label>
                <input
                  type="tel"
                  placeholder="กรุณากรอกเบอร์โทรศัพท์"
                  className="input input-bordered w-full bg-white border-green-200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label text-green-700 font-medium">อีเมล</label>
                <input
                  type="email"
                  placeholder="กรุณากรอกอีเมลของคุณ"
                  className="input input-bordered w-full bg-white border-green-200"
                />
              </div>

              <div>
                <label className="label text-green-700 font-medium">วันที่ต้องการจัด</label>
                <input
                  type="date"
                  className="input input-bordered w-full bg-white border-green-200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label text-green-700 font-medium">จำนวนโต๊ะ/จำนวนคน</label>
                <input
                  type="number"
                  placeholder="กรุณากรอกจำนวน"
                  className="input input-bordered w-full bg-white border-green-200"
                />
              </div>

              <div>
                <label className="label text-green-700 font-medium">ชื่อชุดโต๊ะจีน</label>
                <select className="select select-bordered w-full bg-white border-green-200">
                  <option disabled selected>เลือกชื่อชุดโต๊ะจีน</option>
                  <option>ชุดสุ่ยหลง - 250 บาท/ที่</option>
                  <option>ชุดตงอี้ - 300 บาท/ที่</option>
                  <option>ชุดพิเศษอื่นๆ</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label text-green-700 font-medium">ที่อยู่จัดงาน</label>
              <textarea
                rows="3"
                placeholder="กรุณากรอกรายละเอียดที่อยู่จัดงาน"
                className="textarea textarea-bordered w-full bg-white border-green-200"
              ></textarea>
            </div>

            <div>
              <label className="label text-green-700 font-medium">หมายเหตุเพิ่มเติม</label>
              <textarea
                rows="3"
                placeholder="กรุณากรอกรายละเอียดเพิ่มเติม"
                className="textarea textarea-bordered w-full bg-white border-green-200"
              ></textarea>
            </div>

            <div className="flex items-center mt-6">
              <input type="checkbox" className="checkbox checkbox-green" />
              <label className="label-text ml-2 text-gray-600">
                ฉันยอมรับ <a href="#" className="text-green-600 underline">เงื่อนไขและข้อตกลง</a> ทั้งหมด
              </label>
            </div>

            <button type="submit" className="btn bg-green-600 text-white hover:bg-green-700 w-full mt-6 py-4 text-lg">
              ยืนยันการจอง
            </button>
          </form>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h2 className="text-xl font-bold text-green-700 mb-4">แจ้งเตือนสำคัญ</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>กรุณาจองล่วงหน้าอย่างน้อย 7 วัน ก่อนวันจัดงาน</li>
            <li>กรณีเลื่อนวันจัดงาน ต้องแจ้งล่วงหน้าอย่างน้อย 3 วัน</li>
            <li>สามารถชำระเงินค่ามัดจำได้หลังจากได้รับการยืนยันการจอง</li>
            <li>กรณีมีปริมาณการสั่งอาหารมากกว่า 10 โต๊ะ แจ้งเพื่อขอรับส่วนลดพิเศษได้</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Booking