import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'

import Home from './pages/web/Home'
import Menu from './pages/web/Menu'
import Booking from './pages/web/Booking'
import Login from './pages/web/Login'
import Register from './pages/web/Register'
import WebLayout from './components/layouts/WebLayout'
import Contact from './pages/web/Contact'

import AdminLayout from './components/layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Users from './pages/admin/Users'
import Orders from './pages/admin/Orders'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'

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
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App