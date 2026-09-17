import React, { useState, useEffect } from 'react';
import { seedDatabase, db } from './db/database';
import { Navbar, HowItWorksBar } from './components/Navbar';
import { ListingCatalog } from './components/ListingCatalog';
import { AddCropListing } from './components/AddCropListing';
import { DirectNegotiationChat } from './components/DirectNegotiationChat';
import { PlaceOrderSummary } from './components/PlaceOrderSummary';
import { PaymentCheckoutModal } from './components/PaymentCheckoutModal';
import { OrderTracking } from './components/OrderTracking';
import { RateReviewModal } from './components/RateReviewModal';
import { AdditionalFeaturesSection } from './components/AdditionalFeaturesSection';
import { Sprout, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState('Buyer'); // 'Farmer' or 'Buyer'
  const [activeTab, setActiveTab] = useState('explore'); // explore, add-crop, negotiate, place-order, payment, orders, rate, insights, community
  const [selectedListing, setSelectedListing] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [agreedPrice, setAgreedPrice] = useState(19);

  useEffect(() => {
    seedDatabase();
  }, []);

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

      {/* Main Footer matching Template Banner */}
      <footer className="bg-emerald-950 text-white py-6 border-t border-emerald-800 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span className="font-extrabold text-sm text-emerald-100">Kisan Bazaar</span>
            <span className="text-xs text-emerald-400">• Empowering Farmers. Strengthening Communities. Growing Together.</span>
          </div>
          <p className="text-xs text-emerald-300/80">Built with ❤️ for Agricultural Hackathon 2026</p>
        </div>
      </footer>

    </div>
  );
}
