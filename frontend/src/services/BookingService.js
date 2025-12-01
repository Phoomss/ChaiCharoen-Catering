import http from './http-common';

const API_URL = '/bookings';

const createBooking = (bookingData) => {
    return http.post(API_URL, bookingData);
};

const getAllBookings = () => {
    return http.get(API_URL);
};

const getBookingById = (id) => {
    return http.get(`${API_URL}/${id}`);
};

const updateBookingStatus = (id, statusData) => {
    return http.put(`${API_URL}/${id}/status`, statusData);
};

const deleteBooking = (id) => {
    return http.delete(`${API_URL}/${id}`);
};

const bookingService = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking
};

export default bookingService;