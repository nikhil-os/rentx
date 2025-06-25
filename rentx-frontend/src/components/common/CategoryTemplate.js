// CategoryTemplate.js
// Reusable template for all category pages with enhanced design
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaList, FaThLarge } from 'react-icons/fa';
import { getImageUrl } from '@/utils/api';

export default function CategoryTemplate({ 
  title, 
  description, 
  items, 
  loading, 
  error,
  categoryImage = "/ref1.png" // Default hero image
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortOption, setSortOption] = useState("price-low");
  
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

  // Sort items based on the selected option
  const sortedItems = [...(items || [])].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-emerald-900 to-emerald-700 text-white py-16"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              <p className="text-lg">{description}</p>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src={categoryImage}
                  alt={title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800">Available Items</h2>
            <p className="text-gray-500">{items?.length || 0} items found</p>
          </div>
          
          <div className="flex space-x-4 items-center">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            
            <div className="flex space-x-2 bg-white border border-gray-300 rounded-md p-1">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-emerald-100 text-emerald-800" : "text-gray-500"}`}
                aria-label="Grid view"
              >
                <FaThLarge />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-emerald-100 text-emerald-800" : "text-gray-500"}`}
                aria-label="List view"
              >
                <FaList />
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Items</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* No Results State */}
        {!loading && !error && items?.length === 0 && (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No items found</h3>
            <p className="mt-1 text-gray-500">We couldn't find any items in this category.</p>
          </div>
        )}
        
        {/* Grid View */}
        {!loading && !error && items?.length > 0 && (
          viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item, idx) => (
              <div key={item._id || idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col h-full">
                <div className="relative">
                  <Image
                    src={getImageUrl(item.image || item.img || '/ref1.png')}
                    alt={item.name || item.title}
                    width={400}
                    height={200}
                    className="rounded-md mb-3 object-cover h-52 w-full"
                  />
                  {item.tag && (
                    <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">{item.tag}</span>
                  )}
                </div>
                <h5 className="font-bold text-lg mb-1">{item.name || item.title}</h5>
                <p className="text-gray-500 text-sm mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {item.location}
                </p>
                <div className="flex items-baseline mb-3">
                  <h5 className="text-emerald-800 font-semibold text-lg">₹{item.price}</h5>
                  <span className="text-gray-400 text-sm ml-1">/ day</span>
                </div>
                
                  {item.authenticity && <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">Authenticity: {item.authenticity}</span>}
                  {item.safety && <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">Safety: {item.safety}</span>}
                </div>
                <div className="flex justify-between border-t pt-3 mt-auto text-xs text-gray-500">
                  {item.minDays && (
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Min. {item.minDays} days
                    </span>
                  )}
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    {item.rating || 4.5} ({item.reviews || 0})
                  </span>
                </div>
                <Link 
                  href={`/booking?rentalId=${item._id}`}
                  className="mt-4 block text-center bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-md font-medium tracking-wide transition-colors"
                >
                  Rent Now
                </Link>
              </div>
            ))}
          </div>
        ) : (
            {sortedItems.map((item, idx) => (
              <div key={item._id || idx} className="mb-6">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <Image
                      src={getImageUrl(item.image || item.img || '/ref1.png')}
                      alt={item.name || item.title}
                      width={400}
                      height={300}
                      className="w-full h-56 md:h-full object-cover"
                    />
                    {item.tag && (
                      <span className="absolute top-3 right-3 bg-[#D4A017] text-[#1A1A1A] text-xs px-3 py-1 rounded-full">{item.tag}</span>
                    )}
                  </div>
                  <div className="md:w-2/3 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-bold text-xl">{item.name || item.title}</h5>
                      <div className="flex items-baseline">
                        <h5 className="text-emerald-800 font-semibold text-lg">₹{item.price}</h5>
                        <span className="text-gray-400 text-sm ml-1">/ day</span>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </p>
                    <p className="text-gray-600 mb-4">{item.description || "No description available."}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.authenticity && <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">Authenticity: {item.authenticity}</span>}
                      {item.safety && <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">Safety: {item.safety}</span>}
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-auto text-xs text-gray-500">
                      <div>
                        {item.minDays && (
                          <span className="mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Min. {item.minDays} days
                          </span>
                        )}
                        <span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                          {item.rating || 4.5} ({item.reviews || 0})
                        </span>
                      </div>
                      <Link 
                        href={`/booking?rentalId=${item._id}`}
                        className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-1 rounded-md font-medium tracking-wide transition-colors"
                      >
                        Rent Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {sortedItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-50 border border-gray-100 rounded-lg p-8 inline-block mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-gray-700 font-medium text-lg mb-2">No items found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any {title.toLowerCase()} items available for rent.</p>
              <Link href="/add-product" className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-md font-medium">
                Add a Product
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 