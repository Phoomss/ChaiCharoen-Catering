import React from "react";
import { Link, useLocation } from 'react-router';
import TextScaleButton from './TextScaleButton';

const CustomerNavbar = () => {
    const location = useLocation();

    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || { firstName: 'ลูกค้า', title: 'คุณ' };

    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname === path ? 'text-green-800 font-semibold' : 'text-green-700';
    };

    // Function to handle logout
    const handleLogout = () => {
        // Clear user session/token
        localStorage.removeItem('token');
        localStorage.removeItem('username');
         localStorage.removeItem('userRole');
        // Redirect to login or home
        window.location.href = '/login';
    };

    return (
        <div className="navbar bg-green-50 shadow-sm border-b border-green-200">
            {/* LEFT */}
            <div className="navbar-start">
                {/* Mobile Dropdown */}
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost text-green-700 lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>

                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-green-50 rounded-box z-10 mt-3 w-52 p-2 shadow border border-green-200"
                    >
                        <li><Link to="/customer/dashboard" className={`text-green-700 ${isActive('/customer/dashboard')}`}>แดชบอร์ด</Link></li>
                        <li><Link to="/customer/profile" className={`text-green-700 ${isActive('/customer/profile')}`}>โปรไฟล์ของฉัน</Link></li>
                        <li><Link to="/customer/bookings" className={`text-green-700 ${isActive('/customer/bookings')}`}>การจองของฉัน</Link></li>
                        <li><Link to="/customer/orders" className={`text-green-700 ${isActive('/customer/orders')}`}>คำสั่งซื้อ</Link></li>
                        <li><button onClick={handleLogout} className="text-green-700">ออกจากระบบ</button></li>
                    </ul>
                </div>

                {/* LOGO */}
                <Link to="/customer/dashboard" className="btn btn-ghost text-2xl font-bold text-green-700">
                    ชัยเจริญโภชนา
                </Link>
            </div>

            {/* CENTER (Desktop) */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-green-700">
                    <li><Link to="/customer/dashboard" className={isActive('/customer/dashboard')}>แดชบอร์ด</Link></li>
                    <li><Link to="/customer/profile" className={isActive('/customer/profile')}>โปรไฟล์ของฉัน</Link></li>
                    <li><Link to="/customer/bookings" className={isActive('/customer/bookings')}>การจองของฉัน</Link></li>
                    <li><Link to="/customer/orders" className={isActive('/customer/orders')}>คำสั่งซื้อ</Link></li>
                </ul>
            </div>

            {/* RIGHT */}
            <div className="navbar-end">
                <div className="navbar-end flex items-center space-x-4">
                    <TextScaleButton />
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-green-200 flex items-center justify-center">
                                <span className="text-green-700 font-bold">{user.firstName.charAt(0)}</span>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <Link to="/customer/profile" className="justify-between">
                                    <span>โปรไฟล์ของฉัน</span>
                                </Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>ออกจากระบบ</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerNavbar;