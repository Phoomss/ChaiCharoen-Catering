import React from 'react'

const Testimonials = () => {
    return (
        <section className="py-16 bg-green-50">
            <div className="container mx-auto px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">ความประทับใจจากลูกค้า</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">คำแนะนำและประสบการณ์จากลูกค้าที่ใช้บริการ</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white p-6 rounded-xl shadow-md border border-green-100">
                            <div className="flex items-center mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-600 mb-4">
                                "อาหารอร่อยมากครับ วัตถุดิบสดใหม่ บริการก็ประทับใจมาก ทีมงานน่ารักและเป็นมืออาชีพมาก"
                            </p>
                            <div className="flex items-center">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                                <div className="ml-3">
                                    <p className="font-semibold text-green-800">คุณลูกค้า {item}</p>
                                    <p className="text-gray-500 text-sm">งานแต่งงาน</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials