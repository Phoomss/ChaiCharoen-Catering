import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import CustomerService from '../../services/CustomerService';
import MenuPackageService from '../../services/MenuPackageService';
import UserService from '../../services/UserService';
import BookingService from '../../services/BookingService';
import Swal from 'sweetalert2';

const CustomerBooking = () => {
    // CalendarView Component
    const CalendarView = ({ dateAvailability, maxBookingsPerDay, selectedDate, onDateSelect }) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();

        // Get days in month
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Get first day of month (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Create day cells
        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
            const bookingCount = dateAvailability[dateStr] || 0;

            let bgColor = 'bg-gray-100'; // Default for past dates
            let textColor = 'text-gray-400';
            let isDisabled = true;

            // Check if this date is today or in the future
            if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                if (bookingCount === 0) {
                    bgColor = 'bg-green-500 hover:bg-green-600'; // Available
                    textColor = 'text-white';
                    isDisabled = false;
                } else if (bookingCount === 1) {
                    bgColor = 'bg-yellow-500 hover:bg-yellow-600'; // 1 booking
                    textColor = 'text-white';
                    isDisabled = false;
                } else if (bookingCount >= maxBookingsPerDay) {
                    bgColor = 'bg-red-500'; // Fully booked
                    textColor = 'text-white';
                    isDisabled = true;
                }
            }

            // Check if this date is currently selected
            const isSelected = selectedDate &&
                new Date(selectedDate).toDateString() === date.toDateString();

            days.push(
                <button
                    key={day}
                    onClick={() => !isDisabled && onDateSelect(date)}
                    disabled={isDisabled}
                    className={`
                        p-2 text-center rounded-full transition-colors
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                        ${isSelected ? 'ring-2 ring-blue-500' : ''}
                        ${bgColor} ${textColor}
                        w-10 h-10 flex items-center justify-center
                    `}
                >
                    {day}
                </button>
            );
        }

        const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

        return (
            <div className="max-w-md mx-auto">
                <div className="text-center mb-4">
                    <h4 className="text-lg font-semibold">
                        {new Date(currentYear, currentMonth).toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
                    </h4>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((dayName, index) => (
                        <div key={index} className="text-center font-medium text-gray-700 p-1">
                            {dayName}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days}
                </div>
            </div>
        );
    };

    const navigate = useNavigate();
    const location = useLocation();
    const [bookingData, setBookingData] = useState({
        customer: {
            name: '',
            phone: '',
            email: ''
        },
        customerID: '',
        event_datetime: '',
        table_count: '',
        package: {
            packageID: '',
            package_name: '',
            price_per_table: ''
        },
        location: {
            address: ''
        },
        menu_sets: [],
        notes: ''
    });
    const [menuPackages, setMenuPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [agreed, setAgreed] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [dateAvailability, setDateAvailability] = useState({});
    const [maxBookingsPerDay] = useState(2); // Maximum 2 bookings per day

    useEffect(() => {
        const fetchMenuPackages = async () => {
            try {
                const response = await MenuPackageService.getAllMenuPackages();
                setMenuPackages(response.data.data);

                // Check if there's a selected package from navigation state
                const selectedPackageId = location.state?.selectedPackage;
                if (selectedPackageId) {
                    const selectedPackage = response.data.data.find(pkg => pkg._id === selectedPackageId);
                    if (selectedPackage) {
                        // Set the selected package in booking data
                        const priceValue = typeof selectedPackage.price === 'object'
                            ? selectedPackage.price.$numberDecimal
                            : selectedPackage.price;

                        setBookingData(prev => ({
                            ...prev,
                            package: {
                                packageID: selectedPackage._id,
                                package_name: selectedPackage.name,
                                price_per_table: priceValue
                            }
                        }));
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching menu packages:', error);
                setLoading(false);
            }
        }
        fetchMenuPackages();

        const fetchUserInfo = async () => {
            try {
                const response = await UserService.getUserInfo();
                const user = response.data.data;

                setUserInfo(user);
                setBookingData(prev => ({
                    ...prev,
                    customer: { // ข้อมูลสำหรับฟอร์ม
                        name: `${user.title || ''}${user.firstName} ${user.lastName}`,
                        phone: user.phone,
                        email: user.email
                    },
                    customerID: user._id
                }))
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }
        fetchUserInfo();

        // Fetch date availability to check which dates are fully booked
        const fetchDateAvailability = async () => {
            try {
                const response = await BookingService.getDateAvailability();
                setDateAvailability(response.data.data);
            } catch (error) {
                console.error('Error fetching date availability:', error);
                // If there's an error, we can still proceed without the availability data
                setDateAvailability({});
            }
        }
        fetchDateAvailability();
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('customer.')) {
            const field = name.split('.')[1];
            setBookingData(prev => ({
                ...prev,
                customer: {
                    ...prev.customer,
                    [field]: value
                }
            }));
        } else if (name.startsWith('location.')) {
            const field = name.split('.')[1];
            setBookingData(prev => ({
                ...prev,
                location: {
                    ...prev.location,
                    [field]: value
                }
            }));
        } else {
            setBookingData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePackageChange = (e) => {
        const selectedPackage = menuPackages.find(pkg => pkg._id === e.target.value);

        if (selectedPackage) {
            //  การแก้ไข: ดึงค่าที่เป็น String จาก $numberDecimal หรือใช้ค่าตรงๆ
            const priceValue = typeof selectedPackage.price === 'object'
                ? selectedPackage.price.$numberDecimal
                : selectedPackage.price;

            setBookingData(prev => ({
                ...prev,
                package: {
                    packageID: selectedPackage._id,
                    package_name: selectedPackage.name,
                    //  เก็บราคาเป็น String/Number ที่ใช้งานได้แล้ว
                    price_per_table: priceValue
                }
            }));
        }
    };

    const calculateTotalPrice = () => {
        if (bookingData.package.price_per_table && bookingData.table_count) {
            const price = parseFloat(bookingData.package.price_per_table);
            const count = parseInt(bookingData.table_count);
            return price * count;
        }
        return 0;
    };

    // Function to check if a date is available (has less than max bookings)
    const isDateAvailable = (dateString) => {
        if (!dateString) return true; // If no date selected, assume available

        // Convert the datetime string to just the date part (YYYY-MM-DD)
        const date = new Date(dateString);
        const dateKey = date.toISOString().split('T')[0];

        const currentBookings = dateAvailability[dateKey] || 0;
        return currentBookings < maxBookingsPerDay;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agreed) {
            Swal.fire({
                title: 'กรุณาตกลงเงื่อนไข!',
                text: 'กรุณาตกลงเงื่อนไขและข้อตกลงก่อนดำเนินการต่อ',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#10b981'
            });
            return;
        }

        // Check if selected date is available
        if (!isDateAvailable(bookingData.event_datetime)) {
            Swal.fire({
                title: 'วันที่ไม่ว่าง!',
                text: 'วันที่คุณเลือกมีการจองเต็มแล้ว กรุณาเลือกวันอื่น',
                icon: 'warning',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#10b981'
            });
            return;
        }

        try {
            // Prepare booking data for submission
            const bookingPayload = {
                customer: {
                    customerID: bookingData.customerID,
                    name: bookingData.customer.name,
                    phone: bookingData.customer.phone,
                    email: bookingData.customer.email
                },
                packageId: bookingData.package.packageID,
                event_datetime: new Date(bookingData.event_datetime).toISOString(),
                table_count: parseInt(bookingData.table_count),
                location: {
                    address: bookingData.location.address,
                    latitude: 0, // Will be set via geocoding
                    longitude: 0
                },
                specialRequest: bookingData.notes,
                // Calculate deposit required (e.g., 30% of total)
                deposit_required: calculateTotalPrice() * 0.3
            };

            const response = await CustomerService.createBooking(bookingPayload);

            // Navigate to confirmation page
            navigate(`/customer/booking-confirmation/${response.data.data._id}`);
        } catch (error) {
            console.error('Error creating booking:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง',
                icon: 'error',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#ef4444'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-green-600"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-green-800 text-center mb-8">จองโต๊ะจีน</h1>

                <div className="bg-white p-8 rounded-xl shadow-md border border-green-200 mb-8">
                    <h2 className="text-2xl font-bold text-green-700 mb-6">ข้อมูลการจอง</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Information Section */}
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-green-700 mb-4">ข้อมูลลูกค้า</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="label text-green-700 font-medium">ชื่อ-นามสกุล</label>
                                    <input
                                        type="text"
                                        name="customer.name"
                                        value={bookingData.customer.name}
                                        onChange={handleInputChange}
                                        placeholder="กรุณากรอกชื่อ-นามสกุลของคุณ"
                                        className="input input-bordered w-full bg-white border-green-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label text-green-700 font-medium">เบอร์โทรศัพท์</label>
                                    <input
                                        type="tel"
                                        name="customer.phone"
                                        value={bookingData.customer.phone}
                                        onChange={handleInputChange}
                                        placeholder="กรุณากรอกเบอร์โทรศัพท์"
                                        className="input input-bordered w-full bg-white border-green-200"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label text-green-700 font-medium">อีเมล</label>
                                    <input
                                        type="email"
                                        name="customer.email"
                                        value={bookingData.customer.email}
                                        onChange={handleInputChange}
                                        placeholder="กรุณากรอกอีเมลของคุณ"
                                        className="input input-bordered w-full bg-white border-green-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Booking Details Section */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="label text-green-700 font-medium">วันที่ต้องการจัด</label>
                                <input
                                    type="datetime-local"
                                    name="event_datetime"
                                    value={bookingData.event_datetime}
                                    onChange={handleInputChange}
                                    className={`input input-bordered w-full bg-white border-green-200 ${bookingData.event_datetime && !isDateAvailable(bookingData.event_datetime) ? 'border-red-500 bg-red-50' : ''}`}
                                    min={new Date().toISOString().slice(0, 16)} // Only allow future dates
                                    required
                                />
                                {bookingData.event_datetime && !isDateAvailable(bookingData.event_datetime) && (
                                    <p className="text-red-500 text-sm mt-1">วันที่นี้มีการจองเต็มแล้ว (จองได้สูงสุด {maxBookingsPerDay} ครั้งต่อวัน)</p>
                                )}
                            </div>

                            <div>
                                <label className="label text-green-700 font-medium">จำนวนโต๊ะ</label>
                                <input
                                    type="number"
                                    name="table_count"
                                    value={bookingData.table_count}
                                    onChange={handleInputChange}
                                    placeholder="กรุณากรอกจำนวนโต๊ะ"
                                    min="1"
                                    className="input input-bordered w-full bg-white border-green-200"
                                    required
                                />
                            </div>
                        </div>

                        {/* Calendar View for Date Availability */}
                        <div className="mt-8 bg-white p-6 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-green-700 mb-4">ปฏิทินแสดงวันที่สามารถจองได้</h3>

                            {/* Calendar Legend */}
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm">วันที่สามารถจองได้</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                                    <span className="text-sm">จองแล้ว 1 ครั้ง</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                                    <span className="text-sm">จองเต็ม (2 ครั้ง)</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                                    <span className="text-sm">วันที่ผ่านมา</span>
                                </div>
                            </div>

                            {/* Calendar Component */}
                            <div className="calendar-container">
                                <CalendarView
                                    dateAvailability={dateAvailability}
                                    maxBookingsPerDay={maxBookingsPerDay}
                                    selectedDate={bookingData.event_datetime}
                                    onDateSelect={(date) => {
                                        // Convert date to datetime-local format (YYYY-MM-DDTHH:mm)
                                        const formattedDate = new Date(date).toISOString().slice(0, 16);
                                        setBookingData(prev => ({
                                            ...prev,
                                            event_datetime: formattedDate
                                        }));
                                    }}
                                />
                            </div>
                        </div>

                        {/* Package Selection */}
                        <div>
                            <label className="label text-green-700 font-medium">ชื่อชุดโต๊ะจีน</label>
                            <select
                                name="package"
                                value={bookingData.package.packageID}
                                onChange={handlePackageChange}
                                className="select select-bordered w-full bg-white border-green-200"
                                required
                            >
                                <option value="" disabled>เลือกชื่อชุดโต๊ะจีน</option>
                                {menuPackages?.map(pkg => (
                                    <option key={pkg._id} value={pkg._id}>
                                        {pkg.name} - {typeof pkg.price === 'object'
                                            ? `${pkg.price.$numberDecimal} บาท/โต๊ะ`
                                            : `${pkg.price} บาท/โต๊ะ`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="label text-green-700 font-medium">ที่อยู่จัดงาน</label>
                            <textarea
                                name="location.address"
                                value={bookingData.location.address}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="กรุณากรอกรายละเอียดที่อยู่จัดงาน"
                                className="textarea textarea-bordered w-full bg-white border-green-200"
                                required
                            ></textarea>
                        </div>

                        {/* Additional Notes */}
                        <div>
                            <label className="label text-green-700 font-medium">หมายเหตุเพิ่มเติม</label>
                            <textarea
                                name="notes"
                                value={bookingData.notes}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="กรุณากรอกรายละเอียดเพิ่มเติม"
                                className="textarea textarea-bordered w-full bg-white border-green-200"
                            ></textarea>
                        </div>

                        {/* Price Summary */}
                        {bookingData.package.package_name && bookingData.table_count && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-700 mb-2">สรุปรายการ</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">ชื่อแพ็กเกจ:</p>
                                        <p className="font-medium">{bookingData.package.package_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">จำนวนโต๊ะ:</p>
                                        <p className="font-medium">{bookingData.table_count} โต๊ะ</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">ราคาต่อโต๊ะ:</p>
                                        <p className="font-medium">
                                            {/* 💡 ปรับปรุง: ใช้ค่าตรงๆ ได้เลย */}
                                            {parseFloat(bookingData.package.price_per_table).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">ราคารวม:</p>
                                        <p className="font-medium text-green-700 font-bold">
                                            {calculateTotalPrice().toLocaleString()} บาท
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Terms and Conditions */}
                        <div className="flex items-center mt-6">
                            <input
                                type="checkbox"
                                id="agreement"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="checkbox checkbox-green"
                            />
                            <label htmlFor="agreement" className="label-text ml-2 text-gray-600">
                                ฉันยอมรับ <a href="#" className="text-green-600 underline">เงื่อนไขและข้อตกลง</a> ทั้งหมด
                            </label>
                        </div>

                        {agreed ? (
                            <div>
                                <button
                                    type="submit"
                                    className="btn bg-green-600 text-white hover:bg-green-700 w-full mt-6 py-4 text-lg"
                                >
                                    ยืนยันการจอง
                                </button>
                            </div>
                        ) : (
                            <div className="opacity-50 cursor-not-allowed">
                                <button
                                    type="button"
                                    className="btn bg-green-600 text-white w-full mt-6 py-4 text-lg"
                                    disabled
                                >
                                    ยืนยันการจอง
                                </button>
                                <p className="text-center text-red-500 mt-2 font-medium">
                                    กรุณาตกลงเงื่อนไขและข้อตกลงก่อนยืนยันการจอง
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h2 className="text-xl font-bold text-green-700 mb-4">แจ้งเตือนสำคัญ</h2>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                        <li>กรุณาจองล่วงหน้าอย่างน้อย 7 วัน ก่อนวันจัดงาน</li>
                        <li>กรณีเลื่อนวันจัดงาน ต้องแจ้งล่วงหน้าอย่างน้อย 3 วัน</li>
                        <li>สามารถชำระเงินค่ามัดจำได้หลังจากได้รับการยืนยันการจอง</li>
                        <li>กรณีมีปริมาณการสั่งอาหารมากกว่า 10 โต๊ะ แจ้งเพื่อขอรับส่วนลดพิเศษได้</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CustomerBooking;