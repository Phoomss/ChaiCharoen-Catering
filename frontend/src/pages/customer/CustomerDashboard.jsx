import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import CustomerService from '../../services/CustomerService';

const CustomerDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        customer: { name: "กำลังโหลด..." },
        stats: { totalBookings: 0, totalSpent: 0, upcomingBooking: null },
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await CustomerService.getDashboardSummary();

                setDashboardData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const { customer, stats, recentBookings } = dashboardData;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">ยินดีต้อนรับ, {customer.name}</h1>
                <p className="text-gray-600">แดชบอร์ดจัดการข้อมูลส่วนตัวและการจองของคุณ</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-800">{stats.totalBookings}</h2>
                            <p className="text-gray-600">การจองของฉัน</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-800">0</h2>
                            <p className="text-gray-600">คำสั่งซื้อ</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {stats.upcomingBooking ? new Date(stats.upcomingBooking.date).toLocaleDateString('th-TH') : 'ไม่มี'}
                            </h2>
                            <p className="text-gray-600">กิจกรรมถัดไป</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {typeof stats.totalSpent === 'object'
                                    ? `${stats.totalSpent.$numberDecimal || stats.totalSpent} บาท`
                                    : `${stats.totalSpent || 0} บาท`}
                            </h2>
                            <p className="text-gray-600">ใช้จ่ายทั้งหมด</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">การจองล่าสุด</h2>
                    <div className="space-y-4">
                        {loading ? (
                            <p>กำลังโหลดข้อมูล...</p>
                        ) : recentBookings.length > 0 ? (
                            recentBookings.map((booking, index) => (
                                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-800">{booking.package.package_name}</h3>
                                            <p className="text-sm text-gray-600">วันที่: {new Date(booking.event_datetime).toLocaleDateString('th-TH')}</p>
                                        </div>
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
                                    <p className="mt-2 text-sm text-gray-600">จำนวนโต๊ะ: {booking.table_count} โต๊ะ</p>
                                </div>
                            ))
                        ) : (
                            <p>ไม่มีข้อมูลการจองล่าสุด</p>
                        )}
                    </div>
                    <Link to="/customer/bookings" className="mt-4 text-green-600 hover:underline flex items-center">
                        ดูการจองทั้งหมด
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">คำสั่งซื้อล่าสุด</h2>
                    <div className="space-y-4">
                        <p>ไม่มีคำสั่งซื้อล่าสุด</p>
                        <p className="text-sm text-gray-500">ระบบคำสั่งซื้อยังไม่ได้ถูกพัฒนา</p>
                    </div>
                    <Link to="/customer/orders" className="mt-4 text-green-600 hover:underline flex items-center">
                        ดูคำสั่งซื้อทั้งหมด
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 border border-green-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">การดำเนินการด่วน</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/booking" className="flex flex-col items-center justify-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700">จองโต๊ะจีนใหม่</span>
                    </Link>
                    <Link to="/customer/profile" className="flex flex-col items-center justify-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-700">แก้ไขโปรไฟล์</span>
                    </Link>
                    <Link to="/menu" className="flex flex-col items-center justify-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                        </svg>
                        <span className="text-gray-700">ดูเมนูอาหาร</span>
                    </Link>
                    <div className="flex flex-col items-center justify-center p-4 border border-green-200 rounded-lg cursor-not-allowed opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-gray-700">แจ้งชำระเงิน</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;