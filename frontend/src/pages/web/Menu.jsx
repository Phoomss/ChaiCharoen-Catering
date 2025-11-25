import React, { useState } from 'react';
import { menuData, categoryNames } from '../../data/menuData';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Group menu items by category
  const categories = [...new Set(menuData.map(item => item.category))];

  const filteredMenu = activeCategory === 'all'
    ? menuData
    : menuData.filter(item => item.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 text-center mb-8">เมนูอาหารโต๊ะจีน</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full ${activeCategory === 'all' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
            onClick={() => setActiveCategory('all')}
          >
            ทั้งหมด
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full ${activeCategory === category ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
              onClick={() => setActiveCategory(category)}
            >
              {categoryNames[category]}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMenu.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-green-100">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 mb-4" />
              <h3 className="font-bold text-green-800 text-xl mb-2">{item.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">
                  {item.packagePrice ? `ชุด ${item.packagePrice.toLocaleString()} บาท` : 'ติดต่อเรา'}
                </span>
                <button className="btn btn-sm bg-green-600 text-white hover:bg-green-700">
                  จองโต๊ะ
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <h2 className="text-2xl font-bold text-green-700 mb-4">สอบถามเพิ่มเติม</h2>
          <p className="text-gray-600 mb-4">
            หากท่านมีคำถามเพิ่มเติมเกี่ยวกับเมนูอาหารโต๊ะจีน หรือต้องการสอบถามรายละเอียดเพิ่มเติม
            สามารถติดต่อเราผ่านช่องทางต่างๆ ด้านล่างนี้
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn bg-green-600 text-white hover:bg-green-700">
              ติดต่อผ่าน LINE
            </button>
            <button className="btn btn-outline text-green-600 border-green-600 hover:bg-green-50">
              ส่งข้อความ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu