// import React from 'react';
// import { menuData } from '../../data/menuData';

// const Menu = () => {
//     // Select 4 popular menu items to display on the homepage
//     const popularItems = [
//         menuData.find(item => item.code === "M005"), // เป็ดย่าง + บะหมี่หยก
//         menuData.find(item => item.code === "M002"), // ปลากะพงนึ่งมะนาว
//         menuData.find(item => item.code === "A001"), // หอยจ๊อทอด
//         menuData.find(item => item.code === "S001")  // แกงส้มกุ้ง
//     ].filter(Boolean); // Remove any undefined items if they don't exist

//     return (
//         <>
//             {/* Menu Preview Section */}
//             <section className="py-16">
//                 <div className="container mx-auto px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-green-800 mb-4">เมนูอาหารโต๊ะจีน</h2>
//                         <p className="text-gray-600 max-w-2xl mx-auto">รวมเมนูอาหารจีนยอดนิยมที่ทางร้านแนะนำ</p>
//                     </div>

//                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {popularItems.map((item, index) => (
//                             <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md border border-green-100 hover:shadow-lg transition-shadow">
//                                 <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
//                                 <div className="p-4">
//                                     <h3 className="font-bold text-green-800 mb-2">{item.name}</h3>
//                                     <p className="text-gray-600 text-sm mb-3">{item.description || 'อาหารจีนคุณภาพ วัตถุดิบสดใหม่'}</p>
//                                     <span className="text-green-600 font-bold">ชุด {item.packagePrice ? item.packagePrice.toLocaleString() : 'ติดต่อเรา'} บาท</span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="text-center mt-10">
//                         <a href="/menu" className="btn btn-outline text-green-600 border-green-600 hover:bg-green-50 px-8 py-3 rounded-xl inline-block">
//                             ดูเมนูทั้งหมด
//                         </a>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }

// export default Menu