import React, { useEffect, useState } from "react";

interface Product {
  category: string;
  product_name: string;
  total_sales: number;
}

export const TopProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.182.1:5000/api/top_products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching top products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white py-8 px-4">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-black mb-6 text-left">
          Top 10 Products
        </h2>

        {/* Table */}
        <div className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <div className="grid grid-cols-4 bg-gray-100 font-bold text-black py-3 px-4">
            <div className="text-left">Rank</div>
            <div className="text-left">Product</div>
            <div className="text-left">Category</div>
            <div className="text-right">Sales</div>
          </div>

          {products.map((product, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center py-3 px-4 border-t border-gray-200 text-black"
            >
              <div className="text-left font-semibold">#{index + 1}</div>
              <div className="text-left">{product.product_name}</div>
              <div className="text-left">{product.category}</div>
              <div className="text-right font-semibold">
                ₹{product.total_sales.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
