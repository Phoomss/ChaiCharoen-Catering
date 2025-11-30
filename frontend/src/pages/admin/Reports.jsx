import React, { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, Calendar, Download, Filter, BarChart3, PieChart } from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');

  // Sample data for different reports
  const salesReport = {
    totalRevenue: 456780,
    totalOrders: 1247,
    averageOrderValue: 366.3,
    topSellingItems: [
      { name: 'Tom Yum Goong', sales: 320, revenue: 57600 },
      { name: 'Pad Thai', sales: 280, revenue: 42000 },
      { name: 'Green Curry', sales: 240, revenue: 38400 },
      { name: 'Massaman Curry', sales: 180, revenue: 34200 },
      { name: 'Som Tam', sales: 150, revenue: 18000 }
    ]
  };

  const bookingsReport = {
    totalBookings: 124,
    confirmedBookings: 78,
    pendingBookings: 23,
    cancelledBookings: 15,
    avgGuestsPerEvent: 42
  };

  const inventoryReport = {
    lowStockItems: 5,
    totalItems: 89,
    outOfStockItems: 2,
    avgReorderLevel: 12
  };

  const getReportData = () => {
    switch (reportType) {
      case 'sales':
        return salesReport;
      case 'bookings':
        return bookingsReport;
      case 'inventory':
        return inventoryReport;
      default:
        return salesReport;
    }
  };

  const reportData = getReportData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Generate and view business reports</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Sales Report</option>
              <option value="bookings">Booking Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customer">Customer Report</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {reportType === 'sales' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">฿{reportData.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <TrendingDown className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                  <p className="text-2xl font-semibold text-gray-900">฿{reportData.averageOrderValue}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {reportType === 'bookings' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.confirmedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <TrendingDown className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg. Guests</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.avgGuestsPerEvent}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {reportType === 'inventory' && (
          <>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.lowStockItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-red-100">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-semibold text-gray-900">{reportData.outOfStockItems}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Chart</h3>
            <div className="flex space-x-2">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <BarChart3 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <PieChart className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization would appear here</p>
          </div>
        </div>

        {/* Top Selling Items */}
        {reportType === 'sales' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
            <div className="space-y-4">
              {reportData.topSellingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.sales} sales</p>
                  </div>
                  <p className="font-semibold text-gray-900">฿{item.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportType === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Trends</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Booking trends visualization would appear here</p>
            </div>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Status</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Inventory status visualization would appear here</p>
            </div>
          </div>
        )}
      </div>

      {/* Download Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-8 h-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium">PDF Report</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-8 h-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium">Excel Spreadsheet</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-8 h-8 text-gray-600 mb-2" />
            <span className="text-sm font-medium">CSV Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;