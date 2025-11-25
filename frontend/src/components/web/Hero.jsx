import React from "react";

const Hero = () => {
    return (
        <>
            {/* Hero Section */}
            <section className="min-h-[80vh] bg-white flex items-center px-8 lg:px-24 py-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text */}
                    <div className="space-y-5">
                        <h1 className="text-4xl lg:text-5xl font-bold text-green-700 leading-snug">
                            โต๊ะจีนชัยเจริญโภชนา (เอ๋) นครปฐม
                        </h1>

                        <p className="text-2xl lg:text-3xl font-extrabold text-green-800">
                            ยินดีต้อนรับสู่บริการจองโต๊ะจีนออนไลน์
                        </p>

                        <p className="text-gray-600 leading-relaxed text-lg">
                            ทีมงานเรารับจัดโต๊ะจีนนอกสถานที่
                            งานเล็ก งานใหญ่ พร้อมเสิร์ฟเมนูอาหารจีนแสนอร่อย
                            ด้วยวัตถุดิบสดใหม่ และบริการระดับมืออาชีพ
                        </p>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <button className="btn bg-green-600 text-white hover:bg-green-700 px-8 py-3 text-lg rounded-xl shadow-md">
                                จองตอนนี้
                            </button>
                            <button className="btn btn-outline text-green-600 border-green-600 hover:bg-green-50 px-8 py-3 text-lg rounded-xl">
                                ดูเมนู
                            </button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=1200"
                            className="rounded-2xl shadow-xl w-[260px] sm:w-[330px] lg:w-[400px] xl:w-[450px] object-cover"
                            alt="อาหารโต๊ะจีน ชัยเจริญโภชนา"
                        />
                    </div>

                </div>
            </section>
        </>
    );
};

export default Hero;
