import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import CustomerService from '../../services/CustomerService';
import Swal from 'sweetalert2';

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await CustomerService.getBookingById(id);
                console.log(response.data.data)
                setBooking(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching booking details:', error);
                setLoading(false);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถโหลดข้อมูลการจองได้',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#ef4444'
                });
            }
        };

        if (id) {
            fetchBookingDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-green-600"></span>
                <span className="ml-2">กำลังโหลดข้อมูลการจอง...</span>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">ไม่พบข้อมูลการจอง</h1>
                    <p className="text-gray-600 mb-6">ไม่สามารถพบข้อมูลการจองที่คุณค้นหาได้</p>
                    <Link to="/customer/bookings" className="btn bg-green-600 text-white hover:bg-green-700">
                        กลับไปยังการจองของฉัน
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <div className="mb-6">
                    <Link to="/customer/bookings" className="btn btn-ghost text-green-700 hover:text-green-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับไปยังการจองของฉัน
                    </Link>
                </div>

                {/* Booking header */}
                <div className="bg-white rounded-xl shadow-md border border-green-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">รายละเอียดการจอง #{booking._id?.substring(0, 8)}</h1>
                            <p className="text-gray-600">วันที่จอง: {new Date(booking.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                        <div className="flex items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.payment_status === 'pending-deposit' ? 'bg-yellow-100 text-yellow-800' :
                                booking.payment_status === 'deposit-paid' ? 'bg-blue-100 text-blue-800' :
                                booking.payment_status === 'full-payment' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {booking.payment_status === 'pending-deposit' ? 'รอยืนยัน' :
                                 booking.payment_status === 'deposit-paid' ? 'จ่ายมัดจำแล้ว' :
                                 booking.payment_status === 'full-payment' ? 'ชำระเต็มจำนวน' :
                                 booking.payment_status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Booking info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event details */}
                        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">รายละเอียดงาน</h2>
                            <div className="space-y-3">
                                <div className="flex">
                                    <div className="w-32 text-gray-600">ชื่อชุดโต๊ะจีน</div>
                                    <div className="flex-1 font-medium">{booking.package.package_name}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 text-gray-600">วัน/เวลาจัดงาน</div>
                                    <div className="flex-1 font-medium">{formatDate(booking.event_datetime)}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 text-gray-600">จำนวนโต๊ะ</div>
                                    <div className="flex-1 font-medium">{booking.table_count} โต๊ะ</div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 text-gray-600">ราคารวม</div>
                                    <div className="flex-1 font-medium">
                                        {typeof booking.total_price === 'object' 
                                            ? booking.total_price.$numberDecimal 
                                            : booking.total_price} บาท
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 text-gray-600">มัดจำที่ต้องชำระ</div>
                                    <div className="flex-1 font-medium">
                                        {typeof booking.deposit_required === 'object' 
                                            ? booking.deposit_required.$numberDecimal 
                                            : booking.deposit_required} บาท
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location details */}
                        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">สถานที่จัดงาน</h2>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-gray-600">ที่อยู่</div>
                                    <div className="font-medium">{booking.location.address}</div>
                                </div>
                                <div>
                                    <div className="text-gray-600">พิกัด</div>
                                    <div className="font-medium">{booking.location.latitude}, {booking.location.longitude}</div>
                                </div>
                            </div>
                        </div>

                        {/* Menu sets */}
                        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">รายการอาหาร</h2>
                            {booking.menu_sets && booking.menu_sets.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {booking.menu_sets.map((menu, index) => (
                                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {menu.menu_name} (x{menu.quantity})
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">ยังไม่มีรายการอาหารที่เลือก</p>
                            )}
                        </div>

                        {/* Notes */}
                        {booking.notes && (
                            <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                                <h2 className="text-xl font-bold text-green-700 mb-4">หมายเหตุเพิ่มเติม</h2>
                                <p className="text-gray-700">{booking.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Right column - Customer info and actions */}
                    <div className="space-y-6">
                        {/* Customer info */}
                        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">ข้อมูลลูกค้า</h2>
                            <div className="space-y-3">
                                <div className="flex">
                                    <div className="w-24 text-gray-600">ชื่อ</div>
                                    <div className="flex-1 font-medium">{booking.customer.name}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-24 text-gray-600">โทรศัพท์</div>
                                    <div className="flex-1 font-medium">{booking.customer.phone}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-24 text-gray-600">อีเมล</div>
                                    <div className="flex-1 font-medium">{booking.customer.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Payment info */}
                        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">ข้อมูลการชำระเงิน</h2>
                            <div className="space-y-3">
                                <div className="flex">
                                    <div className="w-32 text-gray-600">สถานะ</div>
                                    <div className="flex-1 font-medium">
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            booking.payment_status === 'pending-deposit' ? 'bg-yellow-100 text-yellow-800' :
                                            booking.payment_status === 'deposit-paid' ? 'bg-blue-100 text-blue-800' :
                                            booking.payment_status === 'full-payment' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {booking.payment_status === 'pending-deposit' ? 'รอยืนยัน' :
                                             booking.payment_status === 'deposit-paid' ? 'จ่ายมัดจำแล้ว' :
                                             booking.payment_status === 'full-payment' ? 'ชำระเต็มจำนวน' :
                                             booking.payment_status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-32 text-gray-600">ยอดมัดจำ</div>
                                    <div className="flex-1 font-medium">
                                        {typeof booking.deposit_required === 'object' 
                                            ? booking.deposit_required.$numberDecimal 
                                            : booking.deposit_required} บาท
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment records */}
                        {booking.payments && booking.payments.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                                <h2 className="text-xl font-bold text-green-700 mb-4">ประวัติการชำระเงิน</h2>
                                <div className="space-y-3">
                                    {booking.payments.map((payment, index) => (
                                        <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">
                                                        {payment.payment_type === 'deposit' ? 'มัดจำ' : 
                                                         payment.payment_type === 'balance' ? 'ยอดคงเหลือ' : 
                                                         payment.payment_type === 'full-payment' ? 'ชำระเต็มจำนวน' : 
                                                         payment.payment_type}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(payment.payment_date).toLocaleDateString('th-TH')}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-medium">
                                                        {typeof payment.amount === 'object' 
                                                            ? payment.amount.$numberDecimal 
                                                            : payment.amount} บาท
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6">
                            <h2 className="text-xl font-bold text-green-700 mb-4">การดำเนินการ</h2>
                            <div className="space-y-3">
                                <button className="btn w-full bg-green-600 text-white hover:bg-green-700">
                                    ติดต่อฝ่ายบริการ
                                </button>
                                <button className="btn w-full bg-gray-200 text-gray-700 hover:bg-gray-300">
                                    พิมพ์ใบแจ้งหนี้
                                </button>
                                <button className="btn w-full border border-red-500 text-red-500 hover:bg-red-50">
                                    ยกเลิกการจอง
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;