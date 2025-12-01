import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get(`http://localhost:3000/api/customer/bookings${statusFilter ? `?status=${statusFilter}` : ''}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setBookings(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [statusFilter]);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">การจองของฉัน</h1>
                <p className="text-gray-600">จัดการและติดตามการจองโต๊ะจีนของคุณ</p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2">
                    <button
                        className={`px-4 py-2 rounded-lg ${statusFilter === '' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setStatusFilter('')}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${statusFilter === 'pending-deposit' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setStatusFilter('pending-deposit')}
                    >
                        รอยืนยัน
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${statusFilter === 'deposit-paid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setStatusFilter('deposit-paid')}
                    >
                        จ่ายมัดจำแล้ว
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${statusFilter === 'full-payment' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                        onClick={() => setStatusFilter('full-payment')}
                    >
                        ชำระเต็มจำนวน
                    </button>
                </div>

                <Link to="/booking" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    จองโต๊ะจีนใหม่
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden border border-green-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-green-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">แพ็กเกจ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">วันที่/เวลา</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">จำนวนโต๊ะ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">สถานะ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">ราคารวม</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                            </tr>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{booking.package.package_name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{new Date(booking.event_datetime).toLocaleDateString('th-TH')}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {booking.table_count} โต๊ะ
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${booking.payment_status === 'pending-deposit' ? 'bg-yellow-100 text-yellow-800' :
                                              booking.payment_status === 'deposit-paid' ? 'bg-blue-100 text-blue-800' :
                                              booking.payment_status === 'full-payment' ? 'bg-green-100 text-green-800' :
                                              'bg-gray-100 text-gray-800'}`}>
                                            {booking.payment_status === 'pending-deposit' ? 'รอยืนยัน' :
                                             booking.payment_status === 'deposit-paid' ? 'จ่ายมัดจำแล้ว' :
                                             booking.payment_status === 'full-payment' ? 'ชำระเต็มจำนวน' :
                                             booking.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {typeof booking.total_price === 'object'
                                            ? booking.total_price.$numberDecimal
                                            : booking.total_price} บาท
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <Link to={`/booking/${booking._id}`} className="text-green-600 hover:text-green-900 mr-3">ดูรายละเอียด</Link>
                                        <Link to="#" className="text-gray-600 hover:text-gray-900">ยกเลิก</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">ไม่มีข้อมูลการจอง</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerBookings;