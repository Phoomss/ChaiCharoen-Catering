import http from './http-common';

const getDashboardSummary = () => {
    return http.get('/customer/dashboard');
};

const getBookings = (status = '') => {
    const params = status ? { status } : {};
    return http.get('/customer/bookings', { params });
};

const getProfile = () => {
    return http.get('/customer/profile');
};

const updateProfile = (data) => {
    return http.put('/customer/profile', data);
};

const createBooking = (data) => {
    return http.post('/bookings', data);
};

const getBookingById = (id) => {
    return http.get(`/bookings/${id}`);
};

const getPackageMenu = () => {
    return http.get('/menu-packages');
};

const CustomerService = {
    getDashboardSummary,
    getBookings,
    getProfile,
    updateProfile,
    createBooking,
    getBookingById,
    getPackageMenu
};

export default CustomerService;