// CategoryTemplate.js
// Reusable template for all category pages with enhanced design, modal support, blur background, and image slider
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CategoryTemplate({ 
  title, 
  description, 
  items, 
  loading, 
  error,
  categoryImage = "/ref1.png",
}) {
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-900"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 inline-block mx-auto">
        <h3 className="text-red-600 font-medium text-lg mb-2">Error Loading Items</h3>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  const sortedItems = [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return (a.price || 0) - (b.price || 0);
      case "price-high": return (b.price || 0) - (a.price || 0);
      case "name-asc": return (a.name || a.title || "").localeCompare(b.name || b.title || "");
      case "name-desc": return (b.name || b.title || "").localeCompare(a.name || a.title || "");
      default: return 0;
    }
  });

  const getImageList = (item) => {
    return [item.image, item.image2, item.image3].map((img) =>
      img ? (img.startsWith('http') ? img : `https://rentx-backend.onrender.com/${img}`) : '/ref1.png'
    );
  };

  return (
    <section className="bg-[#F8F1E9]">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image src={categoryImage} alt={title} fill className="object-cover brightness-75" priority />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold font-playfair mb-4 text-center drop-shadow-md">{title}</h1>
          <p className="text-lg md:text-xl max-w-2xl text-center drop-shadow-md">{description}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h3 className="font-medium">Found {items.length} items</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <label htmlFor="sort" className="text-gray-600">Sort by:</label>
              <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded-md px-2 py-1 text-sm">
                <option value="default">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid View */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
          {sortedItems.map((item, idx) => (
            <div key={item._id || idx} onClick={() => { setSelectedItem(item); setActiveImageIndex(0); }} className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-4 cursor-pointer">
              <Image src={item.image && !item.image.startsWith('http') ? `https://rentx-backend.onrender.com/${item.image}` : (item.image || '/ref1.png')} width={400} height={200} className="rounded-md object-cover mb-3 h-52 w-full" alt={item.name} />
              <h5 className="font-bold text-lg mb-1">{item.name || item.title}</h5>
              <p className="text-gray-500 text-sm mb-1">{item.location}</p>
              <p className="text-emerald-800 font-semibold text-md mb-2">₹{item.price} / day</p>
              <Link href={`/booking?rentalId=${item._id}`} onClick={(e) => e.stopPropagation()} className="block bg-emerald-700 hover:bg-emerald-900 text-white py-2 text-center rounded-md font-semibold">Rent Now</Link>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white w-full md:w-[60%] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
              <button onClick={() => setSelectedItem(null)} className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl">✕</button>

              {/* Slider */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="col-span-2 flex flex-col gap-4 items-center">
                  <Image
                    src={getImageList(selectedItem)[activeImageIndex]}
                    alt="Main"
                    width={600}
                    height={400}
                    className="w-full h-72 object-cover rounded-lg"
                  />
                  <div className="flex gap-2 justify-center">
                    {getImageList(selectedItem).map((img, idx) => (
                      <Image
                        key={idx}
                        src={img}
                        alt={`thumb-${idx}`}
                        width={60}
                        height={60}
                        className={`rounded-full border-2 object-cover cursor-pointer ${idx === activeImageIndex ? 'border-emerald-600' : 'border-gray-300'}`}
                        onClick={() => setActiveImageIndex(idx)}
                      />
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="col-span-3 space-y-3">
                  <h2 className="text-2xl font-bold text-emerald-800">{selectedItem.name || "Sample Name"}</h2>
                  <p className="text-gray-600">📍 {selectedItem.location || "Delhi, India"}</p>
                  <p className="text-gray-500 leading-relaxed">{selectedItem.description || "Detailed item description goes here. Describe material, use-case, compatibility, etc."}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Authenticity:</span> {selectedItem.authenticity || "Verified"}</p>
                    <p><span className="font-semibold">Safety Rating:</span> {selectedItem.safety || "5/5"}</p>
                    <p><span className="font-semibold">Min. Rental Days:</span> {selectedItem.minDays || 1}</p>
                    <p><span className="font-semibold">Rating:</span> {selectedItem.rating || 4.7} ({selectedItem.reviews || 28} reviews)</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-800">₹{selectedItem.price || 499} / day</p>
                  <Link href={`/booking?rentalId=${selectedItem._id}`} className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-lg font-semibold text-lg">Pay Now</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 inline-block mx-auto">
              <h3 className="text-gray-700 font-medium text-lg mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">We could not find any {title.toLowerCase()} items available for rent.</p>
              <Link href="/add-product" className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-md font-medium">Add a Product</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
