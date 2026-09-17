'use client';

import React, { useState } from 'react';
import { 
  Sprout, 
  ShoppingBag, 
  MessageSquare, 
  Truck, 
  CreditCard, 
  Star, 
  Bell, 
  TrendingUp, 
  Sun, 
  Users, 
  FileText, 
  HelpCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  PhoneCall,
  MapPin,
  ShieldCheck,
  User,
  LogOut,
  Moon,
  SlidersHorizontal,
  ArrowRight,
  Send,
  Zap,
  Check,
  Building2,
  Lock,
  DollarSign
} from 'lucide-react';

export function Navbar({ currentRole, setRole, activeTab, setActiveTab, unreadChats, activeOrdersCount, currentUser, onOpenAuth, onLogout, isDarkMode, toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo matching Kisan Bazaar Template */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('explore')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-emerald-950 dark:text-emerald-400 tracking-tight">Kisan</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-500 tracking-tight">Bazaar</span>
              </div>
              <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">From Farm to Buyer, Directly</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'explore'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Browse Crops
            </button>

            {currentRole === 'Farmer' && (
              <button
                onClick={() => setActiveTab('add-crop')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'add-crop'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                List Produce
              </button>
            )}

            <button
              onClick={() => setActiveTab('negotiate')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'negotiate'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Direct Chat
              {unreadChats > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadChats}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'orders'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Truck className="w-4 h-4" />
              Orders & Tracking
              {activeOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('insights')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'insights'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Market Prices
            </button>
          </nav>

          {/* Right Action Bar - Role Switcher & Auth */}
          <div className="flex items-center gap-3">
            {/* Role Switcher Pill */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setRole('Farmer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentRole === 'Farmer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sprout className="w-3.5 h-3.5" />
                Farmer Mode
              </button>
              <button
                onClick={() => setRole('Buyer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  currentRole === 'Buyer'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Buyer Mode
              </button>
            </div>

            {/* Dark/Light Mode Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Server Auth User Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-xl border border-emerald-300">
                  {currentUser.name} ({currentUser.role})
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Server Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function HowItWorksBar({ activeTab, setActiveTab }) {
  const steps = [
    { num: 1, title: 'Sign Up / Login', icon: User, desc: 'Farmers & buyers create account' },
    { num: 2, title: 'List Produce', icon: PlusCircle, desc: 'Upload photo & expected price' },
    { num: 3, title: 'Browse & Search', icon: Search, desc: 'Filter crops by location/price' },
    { num: 4, title: 'Direct Negotiation', icon: MessageSquare, desc: 'Negotiate price in live chat' },
    { num: 5, title: 'Place Order', icon: ShoppingBag, desc: 'Confirm quantity & price' },
    { num: 6, title: 'Pickup / Delivery', icon: Truck, desc: 'Track order progress live' },
    { num: 7, title: 'Payment', icon: CreditCard, desc: 'Secure UPI / Cards via Razorpay' },
    { num: 8, title: 'Rate & Review', icon: Star, desc: 'Build trust in agri community' }
  ];

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-6 px-4 shadow-lg border-b border-emerald-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 pb-3 border-b border-emerald-700/60 gap-2">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Interactive 8-Step Workflow</span>
            <h2 className="text-2xl font-extrabold tracking-tight">How Kisan Bazaar Works?</h2>
            <p className="text-emerald-200 text-xs mt-0.5">A simple journey from farm to fair price • No Middlemen • No Hassle</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Direct Trade
            </span>
          </div>
        </div>

        {/* 8 Step Cards Carousel/Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-emerald-950/50 hover:bg-emerald-800/60 border border-emerald-700/50 p-2.5 rounded-xl transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold text-[10px] flex items-center justify-center border border-emerald-400/40">
                      {step.num}
                    </span>
                    <IconComponent className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{step.title}</h4>
                  <p className="text-[10px] text-emerald-300/80 leading-tight mt-1">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
