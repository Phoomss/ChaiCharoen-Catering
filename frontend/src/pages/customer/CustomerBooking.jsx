import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import CustomerService from '../../services/CustomerService';
import MenuPackageService from '../../services/MenuPackageService';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';

const CustomerBooking = () => {
    const navigate = useNavigate();
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
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        const fetchMenuPackages = async () => {
            try {
                const response = await MenuPackageService.getAllMenuPackages();
                setMenuPackages(response.data.data);
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
                setBookingData((preData) => ({
                    ...preData,
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
    }, []);

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
                                    className="input input-bordered w-full bg-white border-green-200"
                                    required
                                />
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