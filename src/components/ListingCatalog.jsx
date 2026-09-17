'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../db/database';
import { Search, Filter, MapPin, Tag, PlusCircle, Check, Sparkles, MessageSquare, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

export function ListingCatalog({ currentRole, onSelectListing, onStartChat, setActiveTab }) {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedGrade, maxPrice]);

  const fetchListings = async () => {
    let collection = db.listings.where('status').equals('Active');
    let data = await collection.toArray();

    if (selectedCategory !== 'All') {
      data = data.filter(item => item.category === selectedCategory);
    }
    if (selectedGrade !== 'All') {
      data = data.filter(item => item.qualityGrade === selectedGrade);
    }
    data = data.filter(item => item.pricePerUnit <= maxPrice);

    if (searchTerm) {
      data = data.filter(item => 
        item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setListings(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search & Filter Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Step 3: Browse & Search</span>
            <h1 className="text-2xl font-extrabold text-slate-900">Direct Fresh Produce Marketplace</h1>
            <p className="text-slate-500 text-xs">Buy directly from verified farmers across India at non-inflated prices.</p>
          </div>

          {currentRole === 'Farmer' && (
            <button
              onClick={() => setActiveTab('add-crop')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              List New Crop (Step 2)
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Search Bar */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search crop, location, farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains & Pulses</option>
            </select>
          </div>

          {/* Quality Grade Filter */}
          <div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="All">All Quality Grades</option>
              <option value="A Grade">A Grade (Premium Export)</option>
              <option value="B Grade">B Grade (Standard Commercial)</option>
              <option value="C Grade">C Grade (Processing Quality)</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="flex flex-col justify-center">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
              <span>Max Price:</span>
              <span className="text-emerald-700 font-extrabold">₹{maxPrice}/kg</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Crop Cards Grid */}
      {listings.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-300">
          <p className="text-slate-500 font-semibold text-sm mb-2">No crop produce found matching your filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedGrade('All'); setMaxPrice(200); }}
            className="text-xs text-emerald-600 font-bold hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Crop Photo with Badge */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.cropName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${
                      item.qualityGrade === 'A Grade' ? 'badge-grade-a' : 'badge-grade-b'
                    }`}>
                      {item.qualityGrade}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md">
                    <span className="text-lg font-extrabold text-emerald-700">₹{item.pricePerUnit}</span>
                    <span className="text-[10px] font-semibold text-slate-500">/{item.unit}</span>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.cropName}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    <div className="flex items-center text-xs text-slate-600 gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-700">{item.farmerLocation}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Available Stock:</span>
                      <span className="font-extrabold text-slate-900">{item.quantity} {item.unit}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Farmer:</span>
                      <span className="font-semibold text-emerald-700">{item.farmerName} ✓</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onStartChat(item)}
                  className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Negotiate
                </button>
                <button
                  onClick={() => onSelectListing(item)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  Buy Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
