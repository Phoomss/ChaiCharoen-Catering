import React, { useState, useEffect } from 'react';
import { Calendar, User, MapPin, Phone, Mail, Edit, Trash2, Search, CheckCircle, Clock, XCircle, Filter, MoreVertical } from 'lucide-react';
import Swal from 'sweetalert2';
import bookingService from './../../services/BookingService';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All'); // Filter by status
  const [dateRange, setDateRange] = useState({ start: '', end: '' }); // Filter by date range
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load bookings from API when component mounts
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      console.log('Booking API Response:', response.data.data);
      setBookings(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลการจองได้');
      console.error('Error loading bookings:', err);
      Swal.fire({
        icon: 'error',
        title: 'การโหลดข้อมูลล้มเหลว',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาดขณะโหลดข้อมูลการจอง',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // Map backend status to Thai display
      const statusThai =
        newStatus === 'deposit-paid' ? 'ยืนยันแล้ว' :
        newStatus === 'full-payment' ? 'เสร็จสิ้น' :
        newStatus === 'cancelled' ? 'ยกเลิก' :
        'รอดำเนินการ';

      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: `คุณต้องการเปลี่ยนสถานะการจองเป็น ${statusThai} ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ปรับปรุงเลย!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        // Map frontend status values to backend status values
        let backendStatus;
        switch(newStatus) {
          case 'Confirmed':
            backendStatus = 'deposit-paid';
            break;
          case 'Completed':
            backendStatus = 'full-payment';
            break;
          case 'Cancelled':
            backendStatus = 'cancelled';
            break;
          case 'Pending':
            backendStatus = 'pending-deposit';
            break;
          default:
            backendStatus = newStatus;
        }

        const statusData = { status: backendStatus };
        await bookingService.updateBookingStatus(bookingId, statusData);

        // Refresh bookings list
        await loadBookings();

        // Map backend status to Thai display
        const statusThai =
          backendStatus === 'deposit-paid' ? 'ยืนยันแล้ว' :
          backendStatus === 'full-payment' ? 'เสร็จสิ้น' :
          backendStatus === 'cancelled' ? 'ยกเลิก' :
          'รอดำเนินการ';

        Swal.fire({
          icon: 'success',
          title: 'สถานะถูกอัปเดตแล้ว!',
          text: `สถานะการจองได้ถูกอัปเดตเป็น ${statusThai} เรียบร้อยแล้ว`,
          confirmButtonColor: '#22c55e'
        });
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      Swal.fire({
        icon: 'error',
        title: 'การอัปเดตล้มเหลว',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาดขณะอัปเดตสถานะการจอง',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  // Function to delete a booking
  const deleteBooking = async (bookingId) => {
    try {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: "คุณต้องการลบการจองนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        await bookingService.deleteBooking(bookingId);

        // Refresh bookings list
        await loadBookings();

        Swal.fire({
          icon: 'success',
          title: 'ถูกลบแล้ว!',
          text: 'การจองได้ถูกลบเรียบร้อยแล้ว',
          confirmButtonColor: '#22c55e'
        });
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      Swal.fire({
        icon: 'error',
        title: 'การลบล้มเหลว',
        text: err.response?.data?.message || 'เกิดข้อผิดพลาดขณะลบการจอง',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const getStatusColor = (status) => {
    // Map backend status to frontend status for styling
    const displayStatus =
      status === 'deposit-paid' ? 'Confirmed' :
      status === 'pending-deposit' ? 'Pending' :
      status === 'full-payment' ? 'Completed' :
      status === 'cancelled' ? 'Cancelled' : status;

    switch (displayStatus) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    // Map backend status to frontend status for icons
    const displayStatus =
      status === 'deposit-paid' ? 'Confirmed' :
      status === 'pending-deposit' ? 'Pending' :
      status === 'full-payment' ? 'Completed' :
      status === 'cancelled' ? 'Cancelled' : status;

    switch (displayStatus) {
      case 'Confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // Function to clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setDateRange({ start: '', end: '' });
  };

  // Function to view booking details
  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Filter bookings based on search term, status, and date range
  const filteredBookings = bookings.filter(booking => {
    // Search term filter - ensure properties exist and are strings before calling toLowerCase
    const matchesSearch =
      (booking.bookingCode && typeof booking.bookingCode === 'string' && booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking._id && typeof booking._id === 'string' && booking._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.customer?.name && typeof booking.customer.name === 'string' && booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.customer?.email && typeof booking.customer.email === 'string' && booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.customer?.phone && typeof booking.customer.phone === 'string' && booking.customer.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.location?.address && typeof booking.location.address === 'string' && booking.location.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.package?.package_name && typeof booking.package.package_name === 'string' && booking.package.package_name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter - backend uses payment_status field
    const matchesStatus = statusFilter === 'All' || (booking.payment_status === statusFilter);

    // Date range filter - backend uses event_datetime field
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      // Check if booking.event_datetime exists and is valid
      if (!booking.event_datetime) {
        matchesDate = false;
      } else {
        const bookingDate = new Date(booking.event_datetime);
        // Check if the date is valid
        if (isNaN(bookingDate.getTime())) {
          matchesDate = false;
        } else {
          const startDate = dateRange.start ? new Date(dateRange.start) : null;
          const endDate = dateRange.end ? new Date(dateRange.end) : null;

          if (startDate && endDate) {
            matchesDate = bookingDate >= startDate && bookingDate <= endDate;
          } else if (startDate) {
            matchesDate = bookingDate >= startDate;
          } else if (endDate) {
            matchesDate = bookingDate <= endDate;
          }
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{error}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ระบบจัดการการจอง</h1>
          <p className="text-gray-600">จัดการการจองคิวจัดเลี้ยงและอีเว้นท์</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">จำนวนการจองทั้งหมด</p>
              <p className="text-2xl font-semibold text-gray-900">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ยืนยันแล้ว</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(booking => booking.payment_status === 'deposit-paid' && booking.payment_status).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รอดำเนินการ</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(booking => booking.payment_status === 'pending-deposit' && booking.payment_status).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">เดือนนี้</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(booking => {
                  if (!booking.event_datetime) return false;
                  const bookingDate = new Date(booking.event_datetime);
                  const now = new Date();
                  return bookingDate.getMonth() === now.getMonth() &&
                    bookingDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ค้นหาการจองด้วย ID, ชื่อลูกค้า, อีเมล, โทรศัพท์, สถานที่ หรือแพ็กเกจ..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">ทุกสถานะ</option>
              <option value="pending-deposit">รอดำเนินการ</option>
              <option value="deposit-paid">ยืนยันแล้ว</option>
              <option value="full-payment">เสร็จสิ้น</option>
              <option value="cancelled">ยกเลิก</option>
            </select>
          </div>

          {/* Date Range Filter and Clear Button */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={clearFilters}
              className="col-span-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
            >
              ล้าง
            </button>
            <div className="col-span-2 grid grid-cols-2 gap-1">
              <input
                type="date"
                placeholder="วันเริ่มต้น"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="date"
                placeholder="วันสิ้นสุด"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">รายการการจองทั้งหมด</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">รหัสการจอง</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียดอีเว้นท์</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนโต๊ะ/ผู้เข้าร่วม</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.bookingCode || booking._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customer?.name || booking.customer || 'ไม่ระบุ'}</div>
                    <div className="text-sm text-gray-600">{booking.customer?.email || 'ไม่ระบุ'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {booking.event_datetime ? new Date(booking.event_datetime).toLocaleDateString() : 'ไม่ระบุ'} เวลา {booking.event_datetime ? new Date(booking.event_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ไม่ระบุ'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {booking.location?.address || 'ไม่ระบุ'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{booking.package?.package_name || 'ไม่ระบุ'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.table_count || 0} โต๊ะ<br />
                    <span className="font-medium"> {(typeof booking.total_price === 'object'
                                            ? (booking.total_price.$numberDecimal || 0)
                                            : (booking.total_price || 0))} บาท</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.payment_status || 'pending-deposit'}
                      onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(booking.payment_status || 'pending-deposit')} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="pending-deposit">รอดำเนินการ</option>
                      <option value="deposit-paid">ยืนยันแล้ว</option>
                      <option value="full-payment">เสร็จสิ้น</option>
                      <option value="cancelled">ยกเลิก</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      {/* View Details Button */}
                      <button
                        onClick={() => viewBookingDetails(booking)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          Swal.fire({
                            icon: "info",
                            title: "แก้ไขการจอง",
                            text: "ยังไม่เปิดให้ใช้งาน",
                            confirmButtonColor: "#3b82f6"
                          });
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteBooking(booking._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            ไม่พบการจองที่ตรงกับเงื่อนไข
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">รายละเอียดการจอง</h3>
                <button
                  onClick={closeModal}
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
                      <span className="text-gray-800">{selectedBooking.bookingCode || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">ID การจอง:</span>
                      <span className="text-gray-800">{selectedBooking._id}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">วันที่จอง:</span>
                      <span className="text-gray-800">
                        {selectedBooking.booking_date ? new Date(selectedBooking.booking_date).toLocaleDateString() : 'ไม่ระบุ'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">สถานะ:</span>
                      <span className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(selectedBooking.payment_status || 'pending-deposit')}`}>
                        {selectedBooking.payment_status === 'pending-deposit' ? 'รอดำเนินการ' :
                         selectedBooking.payment_status === 'deposit-paid' ? 'ยืนยันแล้ว' :
                         selectedBooking.payment_status === 'full-payment' ? 'เสร็จสิ้น' :
                         selectedBooking.payment_status === 'cancelled' ? 'ยกเลิก' : 'ไม่ทราบ'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">ราคารวม:</span>
                      <span className="text-gray-800 font-medium">{typeof selectedBooking.total_price === 'object' ? selectedBooking.total_price.$numberDecimal : selectedBooking.total_price} บาท</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">เงินมัดจำ:</span>
                      <span className="text-gray-800 font-medium">{typeof selectedBooking.deposit_required === 'object' ? selectedBooking.deposit_required.$numberDecimal : selectedBooking.deposit_required} บาท</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลลูกค้า</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">ชื่อ:</span>
                      <span className="text-gray-800">{selectedBooking.customer?.name || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">อีเมล:</span>
                      <span className="text-gray-800">{selectedBooking.customer?.email || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">เบอร์โทร:</span>
                      <span className="text-gray-800">{selectedBooking.customer?.phone || 'ไม่ระบุ'}</span>
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
                        {selectedBooking.event_datetime ? new Date(selectedBooking.event_datetime).toLocaleDateString() : 'ไม่ระบุ'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">เวลาจัดงาน:</span>
                      <span className="text-gray-800">
                        {selectedBooking.event_datetime ? new Date(selectedBooking.event_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'ไม่ระบุ'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">สถานที่:</span>
                      <span className="text-gray-800">{selectedBooking.location?.address || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">จำนวนโต๊ะ:</span>
                      <span className="text-gray-800">{selectedBooking.table_count || 0} โต๊ะ</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">คำขอพิเศษ:</span>
                      <span className="text-gray-800">{selectedBooking.specialRequest || 'ไม่ระบุ'}</span>
                    </div>
                  </div>
                </div>

                {/* Package Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">ข้อมูลแพ็กเกจ</h4>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">ชื่อแพ็กเกจ:</span>
                      <span className="text-gray-800">{selectedBooking.package?.package_name || 'ไม่ระบุ'}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">ราคาต่อโต๊ะ:</span>
                      <span className="text-gray-800">฿{typeof selectedBooking.package?.price_per_table === 'object' ? selectedBooking.package.price_per_table.$numberDecimal : selectedBooking.package?.price_per_table || 0}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-32 text-gray-600">ชุดอาหาร:</span>
                      <div className="text-gray-800">
                        {selectedBooking.menu_sets && selectedBooking.menu_sets.length > 0 ? (
                          selectedBooking.menu_sets.map((set, index) => (
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
                    <span className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(selectedBooking.payment_status || 'pending-deposit')}`}>
                      {selectedBooking.payment_status === 'pending-deposit' ? 'รอดำเนินการ' :
                       selectedBooking.payment_status === 'deposit-paid' ? 'ชำระเงินแล้ว' :
                       selectedBooking.payment_status === 'full-payment' ? 'ชำระเงินครบถ้วน' :
                       selectedBooking.payment_status === 'cancelled' ? 'ยกเลิก' : 'ไม่ทราบ'}
                    </span>
                  </div>
                  {selectedBooking.payments && selectedBooking.payments.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-600 block mb-2">ประวัติการชำระเงิน:</span>
                      <div className="space-y-2">
                        {selectedBooking.payments.map((payment, index) => (
                          <div key={index} className="flex text-sm">
                            <div className="w-32 text-gray-600">
                              {new Date(payment.payment_date).toLocaleDateString()}:
                            </div>
                            <div className="text-gray-800">
                              ฿{typeof payment.amount === 'object' ? payment.amount.$numberDecimal : payment.amount || 0} ({payment.payment_type})
                              {payment.slip_image && (
                                <div className="mt-1">
                                  <a href={payment.slip_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs">
                                    ดูหลักฐานการชำระเงิน
                                  </a>
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
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;