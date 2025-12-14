import React from 'react';
import { MapPin, Calendar, User } from 'lucide-react';
import MapDisplay from '../shared/MapDisplay';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const getStatusText = (status) => {
    switch (status) {
      case 'pending-deposit':
        return 'รอยืนยัน';
      case 'deposit-paid':
        return 'จ่ายมัดจำแล้ว';
      case 'full-payment':
        return 'ชำระเต็มจำนวน';
      case 'cancelled':
        return 'ยกเลิก';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending-deposit':
        return 'bg-yellow-100 text-yellow-800';
      case 'deposit-paid':
        return 'bg-blue-100 text-blue-800';
      case 'full-payment':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">รายละเอียดการจอง</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Booking Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลการจอง</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">รหัสการจอง:</span>
                  <span className="text-gray-800">{booking.bookingCode || booking.booking_code || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">ID การจอง:</span>
                  <span className="text-gray-800">{booking.id || booking._id}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">วันที่จอง:</span>
                  <span className="text-gray-800">
                    {booking.booking_date
                      ? new Date(booking.booking_date).toLocaleDateString('th-TH')
                      : booking.created_at
                        ? new Date(booking.created_at).toLocaleDateString('th-TH')
                        : booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString('th-TH')
                          : 'ไม่ระบุ'}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">สถานะ:</span>
                  <span className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(booking.status || booking.payment_status)}`}>
                    {getStatusText(booking.status || booking.payment_status)}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">ราคารวม:</span>
                  <span className="text-gray-800 font-medium">
                    ฿{typeof (booking.total_price || booking.amount) === 'object'
                      ? parseFloat((booking.total_price || booking.amount).$numberDecimal || 0).toLocaleString()
                      : parseFloat(booking.total_price || booking.amount || 0).toLocaleString()} บาท
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">เงินมัดจำ:</span>
                  <span className="text-gray-800 font-medium">
                    ฿{typeof booking.deposit_required === 'object'
                      ? parseFloat(booking.deposit_required.$numberDecimal || 0).toLocaleString()
                      : parseFloat(booking.deposit_required || 0).toLocaleString()} บาท
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลลูกค้า</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">ชื่อ:</span>
                  <span className="text-gray-800">{booking.customer?.name || booking.customer || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">อีเมล:</span>
                  <span className="text-gray-800">{booking.customer?.email || booking.customer_email || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">เบอร์โทร:</span>
                  <span className="text-gray-800">{booking.customer?.phone || booking.customer_phone || 'ไม่ระบุ'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Event Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลอีเว้นท์</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">วันที่จัดงาน:</span>
                  <span className="text-gray-800">
                    {booking.event_datetime
                      ? new Date(booking.event_datetime).toLocaleDateString('th-TH')
                      : booking.date
                        ? new Date(booking.date).toLocaleDateString('th-TH')
                        : 'ไม่ระบุ'}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">เวลาจัดงาน:</span>
                  <span className="text-gray-800">
                    {booking.event_datetime
                      ? new Date(booking.event_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'ไม่ระบุ'}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">สถานที่:</span>
                  <span className="text-gray-800">{booking.location?.address || booking.location || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">จำนวนโต๊ะ:</span>
                  <span className="text-gray-800">{booking.tableCount || booking.table_count || 0} โต๊ะ</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">คำขอพิเศษ:</span>
                  <span className="text-gray-800">{booking.specialRequest || booking.special_request || 'ไม่ระบุ'}</span>
                </div>
              </div>

              {/* Location Map */}
              {(booking.location?.latitude && booking.location?.longitude) || (booking.location?.lat && booking.location?.lng) ? (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">แผนที่สถานที่จัดงาน</h4>
                  <MapDisplay
                    latitude={booking.location?.latitude || booking.location?.lat || 0}
                    longitude={booking.location?.longitude || booking.location?.lng || 0}
                    address={booking.location?.address || 'ไม่ระบุ'}
                  />
                </div>
              ) : null}
            </div>

            {/* Package Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลแพ็กเกจ</h4>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">ชื่อแพ็กเกจ:</span>
                  <span className="text-gray-800">{booking.package?.package_name || booking.package || 'ไม่ระบุ'}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">ราคาต่อโต๊ะ:</span>
                  <span className="text-gray-800">
                    ฿{typeof booking.package?.price_per_table === 'object'
                      ? parseFloat(booking.package.price_per_table.$numberDecimal || 0).toLocaleString()
                      : parseFloat(booking.package?.price_per_table || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-32 text-gray-600">ชุดอาหาร:</span>
                  <div className="text-gray-800">
                    {booking.menu_sets && booking.menu_sets.length > 0 ? (
                      booking.menu_sets.map((set, index) => (
                        <div key={index} className="text-sm">{set.menu_name} ({set.quantity})</div>
                      ))
                    ) : (
                      'ไม่ระบุ'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลการชำระเงิน</h4>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-medium w-32 text-gray-600">สถานะการชำระเงิน:</span>
                <span className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(booking.status || booking.payment_status)}`}>
                  {getStatusText(booking.status || booking.payment_status)}
                </span>
              </div>
              {booking.payments && booking.payments.length > 0 && (
                <div>
                  <span className="font-medium text-gray-600 block mb-2">ประวัติการชำระเงิน:</span>
                  <div className="space-y-2">
                    {booking.payments.map((payment, index) => (
                      <div key={index} className="flex text-sm">
                        <div className="w-32 text-gray-600">
                          {new Date(payment.payment_date).toLocaleDateString('th-TH')}:
                        </div>
                        <div className="text-gray-800">
                          ฿{typeof payment.amount === 'object' ? payment.amount.$numberDecimal : payment.amount || 0} ({payment.payment_type})
                          {payment.slip_image && (
                            <div className="mt-1">
                              <a href={payment.slip_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                ดูหลักฐานการชำระเงิน
                              </a>

                              <img
                                src={`http://localhost:8080${payment.slip_image}`}
                                alt={payment.name}
                                className="rounded-md object-cover w-3xl"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;