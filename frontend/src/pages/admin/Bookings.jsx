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

  // Load bookings from API when component mounts
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      console.log('Booking API Response:', response); // Debug log
      // Handle different possible response structures
      let bookingData = [];
      if (response.data && response.data.data) {
        // Response has nested data property
        bookingData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Response is directly an array
        bookingData = response.data;
      } else {
        // Fallback
        bookingData = [];
      }
      setBookings(bookingData);
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
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: `คุณต้องการเปลี่ยนสถานะการจองเป็น ${newStatus} ใช่หรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ปรับปรุงเลย!',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        const statusData = { status: newStatus };
        await bookingService.updateBookingStatus(bookingId, statusData);

        // Refresh bookings list
        await loadBookings();

        Swal.fire({
          icon: 'success',
          title: 'สถานะถูกอัปเดตแล้ว!',
          text: `สถานะการจองได้ถูกอัปเดตเป็น ${newStatus} เรียบร้อยแล้ว`,
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
    switch (status) {
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
    switch (status) {
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

  // Filter bookings based on search term, status, and date range
  const filteredBookings = bookings.filter(booking => {
    // Search term filter - ensure properties exist and are strings before calling toLowerCase
    const matchesSearch =
      (booking.id && typeof booking.id === 'string' && booking.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.customer && typeof booking.customer === 'string' && booking.customer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.email && typeof booking.email === 'string' && booking.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.phone && typeof booking.phone === 'string' && booking.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.location && typeof booking.location === 'string' && booking.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.package && typeof booking.package === 'string' && booking.package.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'All' || (booking.status === statusFilter && booking.status);

    // Date range filter
    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      // Check if booking.eventDate exists and is valid
      if (!booking.eventDate) {
        matchesDate = false;
      } else {
        const bookingDate = new Date(booking.eventDate);
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
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600">Manage catering bookings and events</p>
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
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
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
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(booking => booking.status === 'Confirmed' && booking.status).length}
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(booking => booking.status === 'Pending' && booking.status).length}
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
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {bookings.filter(booking => {
                  if (!booking.eventDate) return false;
                  const bookingDate = new Date(booking.eventDate);
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
              placeholder="Search bookings by ID, customer name, email, phone, location, or package..."
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
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Range Filter and Clear Button */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={clearFilters}
              className="col-span-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
            >
              Clear
            </button>
            <div className="col-span-2 grid grid-cols-2 gap-1">
              <input
                type="date"
                placeholder="Start Date"
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <input
                type="date"
                placeholder="End Date"
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
          <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Event Details</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking._id || booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id || booking._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customer || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{booking.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      {booking.eventDate || 'N/A'} at {booking.eventTime || 'N/A'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {booking.location || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{booking.package || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {booking.guests || 0} guests<br />
                    <span className="font-medium">฿{booking.total?.toLocaleString() || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={booking.status || 'Pending'}
                      onChange={(e) => updateBookingStatus(booking._id || booking.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 ${getStatusColor(booking.status || 'Pending')} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">

                      <button
                        className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                        onClick={() => console.log("Edit booking:", booking._id || booking.id)} // <- จะเปลี่ยนเป็น Modal หรือหน้าแก้ไขภายหลังได้
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                        onClick={() => deleteBooking(booking._id || booking.id)}
                      >
                        <Trash2 className="w-4 h-4" />
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
            No bookings found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;