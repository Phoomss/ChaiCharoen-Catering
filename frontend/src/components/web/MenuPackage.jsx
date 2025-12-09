import React, { useEffect, useState } from 'react'
import menuPackageService from '../../services/MenuPackageService';
import { useNavigate } from 'react-router';
import { convertDecimalValue, formatPriceWithCurrency } from '../../utils/priceUtils';

const MenuPackage = () => {
  const [menuPackages, setMenuPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadMenuData = async () => {
    try {
      setLoading(true);

      const response = await menuPackageService.getAllMenuPackages(); // ← ใส่ await
      setMenuPackages(response.data.data || []);
      setError(null);

    } catch (err) {
      setError('ไม่สามารถโหลดข้อมูลเมนูได้ กรุณาลองอีกครั้ง');
      console.error('Error loading menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (packageId) => {
    navigate('/booking', { state: { selectedPackage: packageId } });
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-8">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">ชุดอาหารโต๊ะจีน</h2>

        {menuPackages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {menuPackages.map((pkg) => (
              <div key={pkg._id} className="bg-white p-6 rounded-xl shadow-md border border-green-100">

                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Package Image</span>
                </div>

                <h3 className="font-bold text-green-800 text-xl mb-2">{pkg.name}</h3>
                <div className="text-lg font-bold text-green-600 mb-2">
                  {formatPriceWithCurrency(pkg.price)}
                </div>

                <div className="mb-3">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">เลือกได้:</span> {pkg.maxSelect} อย่าง
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">ราคาเพิ่มเติม:</span> ฿{convertDecimalValue(pkg.extraMenuPrice)}/อย่าง
                  </p>
                </div>

                <button
                  className="btn bg-green-600 text-white hover:bg-green-700 w-full"
                  onClick={() => handlePackageSelect(pkg._id)}
                >
                  จองชุดนี้
                </button>
              </div>
            ))}

          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            ไม่พบชุดอาหารโต๊ะจีน
          </div>
        )}
      </div>
    </section>
  );
}

export default MenuPackage;
