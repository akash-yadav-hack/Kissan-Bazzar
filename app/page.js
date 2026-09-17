'use client';

import React, { useState, useEffect } from 'react';
import { seedDatabase } from '../src/db/database';
import { Navbar, HowItWorksBar } from '../src/components/Navbar';
import { ListingCatalog } from '../src/components/ListingCatalog';
import { AddCropListing } from '../src/components/AddCropListing';
import { DirectNegotiationChat } from '../src/components/DirectNegotiationChat';
import { PlaceOrderSummary } from '../src/components/PlaceOrderSummary';
import { PaymentCheckoutModal } from '../src/components/PaymentCheckoutModal';
import { OrderTracking } from '../src/components/OrderTracking';
import { RateReviewModal } from '../src/components/RateReviewModal';
import { AdditionalFeaturesSection } from '../src/components/AdditionalFeaturesSection';
import { AuthModal } from '../src/components/AuthModal';
import { Sprout } from 'lucide-react';

export default function Home() {
  const [currentRole, setCurrentRole] = useState('Buyer');
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedListing, setSelectedListing] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [agreedPrice, setAgreedPrice] = useState(19);

  // Server Auth State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Dark / Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    seedDatabase();
    // Load stored server auth user session
    const stored = localStorage.getItem('kissan_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentUser(u);
        setCurrentRole(u.role);
      } catch (e) {
        console.error('Error loading stored user:', e);
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('kissan_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kissan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kissan_theme', 'light');
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
  };

  const handleLogout = () => {
    localStorage.removeItem('kissan_auth_token');
    localStorage.removeItem('kissan_user');
    setCurrentUser(null);
  };

  const handleStartChat = (listing) => {
    setSelectedListing(listing);
    setActiveTab('negotiate');
  };

  const handleProceedToOrder = (listing, price) => {
    setSelectedListing(listing);
    setAgreedPrice(price);
    setActiveTab('place-order');
  };

  const handleOrderPlaced = (order) => {
    setActiveOrder(order);
    setActiveTab('payment');
  };

  const handlePaymentComplete = () => {
    setActiveTab('orders');
  };

  const handleRateOrder = (order) => {
    setActiveOrder(order);
    setActiveTab('rate');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      <div>
        {/* Top Navbar */}
        <Navbar
          currentRole={currentRole}
          setRole={setCurrentRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadChats={1}
          activeOrdersCount={1}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* 8-Step Interactive Banner matching Template */}
        <HowItWorksBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content View Switcher */}
        <main>
          {activeTab === 'explore' && (
            <ListingCatalog
              currentRole={currentRole}
              onSelectListing={(listing) => {
                setSelectedListing(listing);
                setActiveTab('place-order');
              }}
              onStartChat={handleStartChat}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'add-crop' && (
            <AddCropListing
              currentRole={currentRole}
              onCreated={() => setActiveTab('explore')}
              onCancel={() => setActiveTab('explore')}
            />
          )}

          {activeTab === 'negotiate' && (
            <DirectNegotiationChat
              currentRole={currentRole}
              targetListing={selectedListing}
              onProceedToOrder={handleProceedToOrder}
            />
          )}

          {activeTab === 'place-order' && (
            <PlaceOrderSummary
              listing={selectedListing}
              agreedPrice={agreedPrice}
              onOrderPlaced={handleOrderPlaced}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentCheckoutModal
              order={activeOrder}
              onPaymentComplete={handlePaymentComplete}
            />
          )}

          {activeTab === 'orders' && (
            <OrderTracking
              currentRole={currentRole}
              onRateOrder={handleRateOrder}
            />
          )}

          {activeTab === 'rate' && (
            <RateReviewModal
              order={activeOrder}
              onCompleted={() => setActiveTab('explore')}
            />
          )}

          {/* Footer Additional Modules */}
          <AdditionalFeaturesSection />
        </main>
      </div>

      {/* Real Server Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Main Footer matching Template Banner */}
      <footer className="bg-emerald-950 text-white py-6 border-t border-emerald-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-sm text-emerald-100">Kisan Bazaar</span>
            <span className="text-xs text-emerald-400">• Empowering Farmers. Strengthening Communities. Growing Together.</span>
          </div>
          <p className="text-xs text-emerald-300/80">Built with ❤️ for Agricultural Hackathon 2026 (Next.js + SQLite Backend)</p>
        </div>
      </footer>

    </div>
  );
}
