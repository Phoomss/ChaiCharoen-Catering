import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus, Users, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import StatsCard from '../../components/card/admin/StatusCard';
import { Link } from 'react-router';
import axios from 'axios';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    monthlyRevenue: []
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, you would fetch from your API
        // For now, using mock data to demonstrate the dashboard

        // Mock booking data for demonstration
        setStatsData({
          totalUsers: 125,
          totalBookings: 43,
          totalRevenue: 456780,
          pendingBookings: 8,
          completedBookings: 27,
          monthlyRevenue: [
            { month: 'ม.ค.', revenue: 120000 },
            { month: 'ก.พ.', revenue: 150000 },
            { month: 'มี.ค.', revenue: 110000 },
            { month: 'เม.ย.', revenue: 130000 },
            { month: 'พ.ค.', revenue: 170000 },
            { month: 'มิ.ย.', revenue: 200000 },
            { month: 'ก.ค.', revenue: 180000 },
            { month: 'ส.ค.', revenue: 190000 },
            { month: 'ก.ย.', revenue: 210000 },
            { month: 'ต.ค.', revenue: 160000 },
            { month: 'พ.ย.', revenue: 220000 },
            { month: 'ธ.ค.', revenue: 195000 }
          ]
        });

        // Mock recent bookings
        setRecentBookings([
          { id: '654321', customer: 'สมชาย ใจดี', package: 'ชุดสุ่ยหลง', date: '25 ธ.ค. 2023', tableCount: 20, amount: 50000, status: 'pending-deposit' },
          { id: '654322', customer: 'สมหญิง สวยใส', package: 'ชุดตงอี้', date: '28 ธ.ค. 2023', tableCount: 15, amount: 45000, status: 'deposit-paid' },
          { id: '654323', customer: 'นพ รักสงบ', package: 'ชุดพิเศษ', date: '30 ธ.ค. 2023', tableCount: 25, amount: 75000, status: 'full-payment' },
          { id: '654324', customer: 'พิมพ์ สบายใจ', package: 'ชุดสุ่ยหลง', date: '27 ธ.ค. 2023', tableCount: 18, amount: 54000, status: 'pending-deposit' },
          { id: '654325', customer: 'ธนาธิป สว่างจิต', package: 'ชุดตงอี้', date: '26 ธ.ค. 2023', tableCount: 30, amount: 90000, status: 'full-payment' },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Map status to appropriate display text and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending-deposit':
        return { text: 'รอยืนยัน', color: 'bg-yellow-100 text-yellow-800' };
      case 'deposit-paid':
        return { text: 'จ่ายมัดจำแล้ว', color: 'bg-blue-100 text-blue-800' };
      case 'full-payment':
        return { text: 'ชำระเต็มจำนวน', color: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'ยกเลิก', color: 'bg-red-100 text-red-800' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Stats cards for catering business
  const statsCards = [
    {
      title: 'จำนวนลูกค้าทั้งหมด',
      value: statsData.totalUsers,
      change: '+12%',
      trend: 'up',
      color: 'blue',
      icon: <Users className="w-6 h-6 text-white" />
    },
    {
      title: 'การจองทั้งหมด',
      value: statsData.totalBookings,
      change: '+8%',
      trend: 'up',
      color: 'green',
      icon: <Calendar className="w-6 h-6 text-white" />
    },
    {
      title: 'รายได้รวม',
      value: `฿${statsData.totalRevenue.toLocaleString()}`,
      change: '+15%',
      trend: 'up',
      color: 'yellow',
      icon: <DollarSign className="w-6 h-6 text-white" />
    },
    {
      title: 'การจองที่ยังไม่เสร็จ',
      value: statsData.pendingBookings,
      change: '-3%',
      trend: 'down',
      color: 'purple',
      icon: <ShoppingBag className="w-6 h-6 text-white" />
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">แดชบอร์ดแอดมิน</h1>
          <p className="text-gray-600">ภาพรวมสถานะธุรกิจโต๊ะจีน ชัยเจริญโภชนา</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/admin/bookings" className="btn bg-green-600 text-white hover:bg-green-700">
            จัดการการจอง
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${
              stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
              stat.color === 'green' ? 'from-green-500 to-green-600' :
              stat.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
              'from-purple-500 to-purple-600'
            } flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ?
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg> :
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                }
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">รายได้รายเดือน (ปีนี้)</h3>
          <div className="h-64 flex items-end space-x-2">
            {statsData.monthlyRevenue.map((month, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-600 mb-1">{month.month}</div>
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                  style={{ height: `${(month.revenue / 250000) * 100}%` }}
                ></div>
                <div className="text-xs mt-1">฿{(month.revenue/1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">สถานะการจอง</h3>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48 rounded-full border-8 border-green-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">{statsData.totalBookings}</div>
                <div className="text-gray-600">การจองทั้งหมด</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">การจองล่าสุด</h3>
            <Link to="/admin/bookings" className="btn btn-sm bg-green-600 text-white hover:bg-green-700">
              ดูทั้งหมด
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID การจอง</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ชุดโต๊ะจีน</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่จัด</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนโต๊ะ</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.package}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{booking.tableCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">฿{booking.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusInfo(booking.status).color}`}>
                      {getStatusInfo(booking.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Link to={`/admin/bookings/${booking.id}`} className="p-1 hover:bg-gray-100 rounded text-blue-600">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link to={`/admin/bookings/${booking.id}/edit`} className="p-1 hover:bg-gray-100 rounded text-yellow-600">
                        <Edit className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">ลูกค้าใหม่ (เดือนนี้)</h3>
          <div className="text-3xl font-bold text-green-600">24</div>
          <div className="text-sm text-gray-600 mt-1">+5 จากเดือนที่แล้ว</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">การจองใหม่ (สัปดาห์นี้)</h3>
          <div className="text-3xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-600 mt-1">+2 จากสัปดาห์ที่แล้ว</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">อัตราการสำเร็จ</h3>
          <div className="text-3xl font-bold text-purple-600">78%</div>
          <div className="text-sm text-gray-600 mt-1">+3% จากเดือนที่แล้ว</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;