import http from './http-common';

const BOOKING_API_URL = '/bookings';
const PAYMENT_SLIP_API_URL = '/payment-slips';

// Create a separate axios instance for file uploads with different config
const fileUploadHttp = {
    ...http,
    post: (url, data, config) => {
        return http.post(url, data, {
            ...config,
            headers: {
                'Content-Type': 'multipart/form-data',
                ...config?.headers
            }
        });
    }
};

const createBooking = (bookingData) => {
    return http.post(BOOKING_API_URL, bookingData);
};

const getAllBookings = () => {
    return http.get(BOOKING_API_URL);
};

const getBookingById = (id) => {
    return http.get(`${BOOKING_API_URL}/${id}`);
};

const updateBookingStatus = (id, statusData) => {
    return http.put(`${BOOKING_API_URL}/${id}/status`, statusData);
};

const deleteBooking = (id) => {
    return http.delete(`${BOOKING_API_URL}/${id}`);
};

// Function to upload payment slip
const uploadPaymentSlip = (file) => {
    const formData = new FormData();
    formData.append('slip', file);

    return fileUploadHttp.post(`${PAYMENT_SLIP_API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const bookingService = {
    createBooking,
    getAllBookings,
    getBookingById,
    updateBookingStatus,
    deleteBooking,
    uploadPaymentSlip
};

export default bookingService;