import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'

import Home from './pages/web/Home'
import Menu from './pages/web/Menu'
import Booking from './pages/web/Booking'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import WebLayout from './components/layouts/WebLayout'
import Contact from './pages/web/Contact'

import AdminLayout from './components/layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Orders from './pages/admin/Orders'
import Analytics from './pages/admin/Analytics'
import MenuManagement from './pages/admin/MenuManagement'
import Categories from './pages/admin/Categories'
import Bookings from './pages/admin/Bookings'
import Locations from './pages/admin/Locations'
import Reports from './pages/admin/Reports'
import Chefs from './pages/admin/Chefs'
import MenuPackages from './pages/admin/MenuPackages'

import CustomerLayout from './components/layouts/CustomerLayout'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CustomerProfile from './pages/customer/CustomerProfile'
import CustomerBookings from './pages/customer/CustomerBookings'
import CustomerOrders from './pages/customer/CustomerOrders'
import CustomerBooking from './pages/customer/CustomerBooking'
import BookingConfirmation from './pages/customer/BookingConfirmation'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<WebLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/booking' element={<Booking />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/menu" element={<MenuManagement />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/customers" element={<Users />} />
          <Route path="/admin/chefs" element={<Chefs />} />
          <Route path="/admin/locations" element={<Locations />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/menu-packages" element={<MenuPackages />} />
        </Route>

        <Route element={<CustomerLayout />}>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          <Route path="/customer/bookings" element={<CustomerBookings />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
          <Route path="/customer/booking" element={<CustomerBooking />} />
          <Route path="/customer/booking-confirmation/:id" element={<BookingConfirmation />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App