import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'

import Home from './pages/web/Home'
import Menu from './pages/web/Menu'
import Booking from './pages/web/Booking'
import Login from './pages/web/Login'
import Register from './pages/web/Register'
import WebLayout from './components/layouts/WebLayout'
import Contact from './pages/web/Contact'

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

      </Routes>
    </BrowserRouter>
  )
}

export default App