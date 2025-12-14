import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Plus, Users, Calendar, ShoppingBag, DollarSign } from 'lucide-react';
import { Link } from 'react-router';
import adminService from '../../services/AdminService';
import bookingService from '../../services/BookingService';
import BookingDetailsModal from './../../components/admin/BookingDetailsModal';

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
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminService.getDashboardSummary();
        const data = response.data.data;
        // console.log(data)
        setStatsData({
          totalUsers: data.stats.totalUsers,
          totalBookings: data.stats.totalBookings,
          totalRevenue: data.stats.totalRevenue,
          pendingBookings: data.stats.pendingBookings,
          depositPaidBookings: data.stats.depositPaidBookings,
          fullPaymentBookings: data.stats.fullPaymentBookings,
          cancelledBookings: data.stats.cancelledBookings,
          newUsersThisMonth: data.stats.newUsersThisMonth,
          newBookingsThisWeek: data.stats.newBookingsThisWeek,
          successRate: data.stats.successRate,
          monthlyRevenue: data.monthlyRevenue
        });

        // Format recent bookings from the API response
        setRecentBookings(data.recentBookings.map(booking => ({
          id: booking._id,
          bookingCode: booking.bookingCode,
          customer: `${booking.customer.name}`,
          package: booking.package.package_name,
          date: new Date(booking.event_datetime).toLocaleDateString('th-TH'),
          tableCount: booking.table_count,
          amount: typeof booking.total_price === 'object'
            ? parseFloat(booking.total_price.$numberDecimal)
            : booking.total_price,
          status: booking.payment_status
        })));

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

  // Function to view booking details in modal
  const viewBookingDetails = async (booking) => {
    try {
      // If the booking object already has many properties, assume it's detailed from another source
      // Otherwise, fetch the full booking details from backend using the booking ID
      if (booking._id && Object.keys(booking).length > 8) { // If booking has many properties, assume it's detailed
        setSelectedBooking(booking);
        setShowModal(true);
      } else {
        // Fetch the full booking details from backend using either the id or _id field
        const bookingId = booking.id || booking._id;
        const response = await bookingService.getBookingById(bookingId);
        setSelectedBooking(response.data.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      // Fallback to display the limited booking info from the dashboard
      setSelectedBooking(booking);
      setShowModal(true);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
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
      value: `฿${typeof statsData.totalRevenue === 'object'
        ? parseFloat(statsData.totalRevenue.$numberDecimal || 0).toLocaleString()
        : parseFloat(statsData.totalRevenue || 0).toLocaleString()}`,
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
    <div>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">รอยืนยัน</span>
              </div>
              <span className="text-sm font-medium">{statsData.pendingBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${(statsData.pendingBookings / Math.max(statsData.totalBookings, 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">จ่ายมัดจำแล้ว</span>
              </div>
              <span className="text-sm font-medium">{statsData.depositPaidBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${(statsData.depositPaidBookings / Math.max(statsData.totalBookings, 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">ชำระเต็มจำนวน</span>
              </div>
              <span className="text-sm font-medium">{statsData.fullPaymentBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(statsData.fullPaymentBookings / Math.max(statsData.totalBookings, 1)) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">ยกเลิก</span>
              </div>
              <span className="text-sm font-medium">{statsData.cancelledBookings}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: `${(statsData.cancelledBookings / Math.max(statsData.totalBookings, 1)) * 100}%` }}
              ></div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{booking.bookingCode}</td>
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
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600"
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
          <div className="text-3xl font-bold text-green-600">{statsData.newUsersThisMonth}</div>
          <div className="text-sm text-gray-600 mt-1">- จากเดือนที่แล้ว</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">การจองใหม่ (สัปดาห์นี้)</h3>
          <div className="text-3xl font-bold text-blue-600">{statsData.newBookingsThisWeek}</div>
          <div className="text-sm text-gray-600 mt-1">- จากสัปดาห์ที่แล้ว</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">อัตราการสำเร็จ</h3>
          <div className="text-3xl font-bold text-purple-600">{statsData.successRate}%</div>
          <div className="text-sm text-gray-600 mt-1">- จากเดือนที่แล้ว</div>
        </div>
      </div>
    </div>

    {/* Booking Details Modal */}
    {showModal && (
      <BookingDetailsModal
        isOpen={showModal}
        onClose={closeModal}
        booking={selectedBooking}
      />
    )}
  </div>
);
};

export default Dashboard;