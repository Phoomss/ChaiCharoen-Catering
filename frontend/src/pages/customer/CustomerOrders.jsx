import React from 'react';
import { Link } from 'react-router';

const CustomerOrders = () => {
    const orders = [
        {
            id: 1001,
            date: "15 ธันวาคม 2023",
            items: 3,
            status: "จัดส่งแล้ว",
            total: "3,500 บาท",
            address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม 10110"
        },
        {
            id: 1002,
            date: "10 ธันวาคม 2023",
            items: 1,
            status: "อยู่ในการจัดส่ง",
            total: "1,200 บาท",
            address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม 10110"
        },
        {
            id: 1003,
            date: "5 ธันวาคม 2023",
            items: 2,
            status: "เสร็จสิ้น",
            total: "2,800 บาท",
            address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม 10110"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">คำสั่งซื้อของฉัน</h1>
                <p className="text-gray-600">ติดตามสถานะคำสั่งซื้อของคุณ</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-green-100 mb-6">
                <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">ยังไม่มีฟีเจอร์คำสั่งซื้อ</h3>
                    <p className="mt-2 text-gray-600">ระบบคำสั่งซื้อยังไม่ได้ถูกพัฒนาในขณะนี้</p>
                    <div className="mt-6">
                        <Link to="/customer/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            กลับไปยังแดชบอร์ด
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrders;