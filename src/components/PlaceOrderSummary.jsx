import React, { useState } from 'react';
import { db } from '../db/database';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard, CheckCircle2, MapPin, Locate, Crosshair, Home, Building2, Store, Check, X } from 'lucide-react';

export function PlaceOrderSummary({ listing, agreedPrice, onOrderPlaced }) {
  const [quantity, setQuantity] = useState(500);
  const [addressType, setAddressType] = useState('Home'); // Home, Office, Shop
  const [houseShopNo, setHouseShopNo] = useState('Plot No 42');
  const [streetArea, setStreetArea] = useState('APMC Market, Vashi');
  const [cityState, setCityState] = useState('Navi Mumbai, Maharashtra - 400703');
  const [landmark, setLandmark] = useState('Near Gate No. 3');

  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocationName, setMapLocationName] = useState('Vashi APMC Market, Navi Mumbai');
  const [pinPosition, setPinPosition] = useState({ lat: 19.076, lng: 73.0075 });
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const finalPricePerKg = agreedPrice || (listing ? listing.pricePerUnit : 19);
  const totalAmount = quantity * finalPricePerKg;

  // Detect Current Location using Geolocation API
  const handleDetectCurrentLocation = () => {
    setDetectingLocation(true);
    setShowMapModal(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPinPosition({ lat, lng });
          
          // Simulated Reverse Geocode lookup
          setMapLocationName(`GPS Detected: Sector 19, Vashi, Navi Mumbai (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`);
          setCityState('Navi Mumbai, Maharashtra - 400703');
          setDetectingLocation(false);
        },
        (error) => {
          console.warn('Geolocation error or denied:', error);
          setMapLocationName('Vashi APMC Market, Navi Mumbai (Default Pin)');
          setDetectingLocation(false);
        }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  const handleConfirmLocationFromMap = () => {
    setShowMapModal(false);
    setStreetArea(mapLocationName);
  };

  const fullFormattedAddress = `[${addressType.toUpperCase()}] ${houseShopNo}, ${streetArea}, Landmark: ${landmark}, ${cityState}`;

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const newOrder = {
        listingId: listing ? listing.id : 1,
        buyerId: 2,
        buyerName: 'Aniket Sharma',
        farmerId: listing ? listing.farmerId : 1,
        farmerName: listing ? listing.farmerName : 'Ramesh Patil',
        cropName: listing ? listing.cropName : 'Fresh Tomatoes',
        quantity: quantity,
        unit: listing ? listing.unit : 'kg',
        pricePerUnit: finalPricePerKg,
        totalPrice: totalAmount,
        deliveryAddress: fullFormattedAddress,
        addressType: addressType,
        paymentMethod: 'UPI (GPay/PhonePe)',
        paymentStatus: 'Pending',
        orderStatus: 'Order Confirmed',
        trackingHistory: [
          { status: 'Order Confirmed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
          { status: 'Preparing Produce', time: 'Pending', completed: false },
          { status: 'Out for Delivery', time: 'Pending', completed: false },
          { status: 'Delivered', time: 'Pending', completed: false }
        ],
        createdAt: new Date().toISOString()
      };

      const orderId = await db.orders.add(newOrder);
      setTimeout(() => {
        onOrderPlaced({ ...newOrder, id: orderId });
      }, 600);
    } catch (err) {
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 relative">
        
        <div className="border-b border-slate-100 pb-4 mb-6">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Step 5: Place Order</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Order & Delivery Details</h1>
          <p className="text-slate-500 text-xs mt-1">Select location on interactive map or enter shop/home details.</p>
        </div>

        {/* Selected Crop Card */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6">
          <img
            src={listing ? listing.photoUrl : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'}
            alt="Crop"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">{listing ? listing.cropName : 'Fresh Tomatoes'}</h3>
            <p className="text-xs font-semibold text-emerald-700">Agreed Price: ₹{finalPricePerKg}/kg</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Farmer: {listing ? listing.farmerName : 'Ramesh Patil'} ({listing ? listing.farmerLocation : 'Nashik'})</p>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">Order Quantity ({listing ? listing.unit : 'kg'})</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Delivery Address Section with Map Auto-Detect */}
        <div className="space-y-4 mb-6 p-5 bg-slate-50/80 rounded-2xl border border-slate-200">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">Delivery Address</h4>
              <p className="text-[10px] text-slate-500">Auto-detect GPS position or choose address tag</p>
            </div>

            {/* Choose Current Location Button */}
            <button
              type="button"
              onClick={handleDetectCurrentLocation}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Crosshair className="w-4 h-4" />
              Choose Current Location (Map)
            </button>
          </div>

          {/* Address Tag Selector (Shop, Home, Office) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Save Address As</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAddressType('Shop')}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  addressType === 'Shop' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600" />
                Shop / Mandi
              </button>

              <button
                type="button"
                onClick={() => setAddressType('Home')}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  addressType === 'Home' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Home className="w-4 h-4 text-emerald-600" />
                Home
              </button>

              <button
                type="button"
                onClick={() => setAddressType('Office')}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                  addressType === 'Office' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Office / Godown
              </button>
            </div>
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {addressType === 'Shop' ? 'Shop / Stall No *' : addressType === 'Office' ? 'Office / Unit No *' : 'Flat / House No *'}
              </label>
              <input
                type="text"
                value={houseShopNo}
                onChange={(e) => setHouseShopNo(e.target.value)}
                placeholder="e.g. Shop #14-B"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Nearby Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Gate 3"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">Street / Area (Detected from Map)</label>
            <input
              type="text"
              value={streetArea}
              onChange={(e) => setStreetArea(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">City, State & Pincode</label>
            <input
              type="text"
              value={cityState}
              onChange={(e) => setCityState(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

        </div>

        {/* Total Price Calculation */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 mb-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Subtotal ({quantity} kg × ₹{finalPricePerKg}):</span>
            <span>₹{(quantity * finalPricePerKg).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Direct Farmer Delivery / Pickup Fee:</span>
            <span className="text-emerald-700 font-bold">FREE (Direct)</span>
          </div>
          <div className="border-t border-emerald-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Amount Payable:</span>
            <span className="text-xl font-extrabold text-emerald-700">₹{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={handleConfirmOrder}
          disabled={loading}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {loading ? 'Confirming...' : 'Confirm Order & Proceed to Payment (Step 7)'}
        </button>

      </div>

      {/* Interactive Map Picker Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold">Select Delivery Location on Map</h3>
                  <p className="text-[10px] text-slate-400">Drag map pin to adjust exact location</p>
                </div>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Interactive Map Display */}
            <div className="relative h-64 bg-slate-200 overflow-hidden flex items-center justify-center">
              {/* Map Graphic Layer */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-sm flex items-center gap-2">
                <Locate className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>{detectingLocation ? 'Locating GPS Position...' : 'GPS Pin Active'}</span>
              </div>

              {/* Center Map Pin Marker */}
              <div className="relative z-10 flex flex-col items-center -mt-6">
                <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-extrabold shadow-lg mb-1 whitespace-nowrap animate-bounce">
                  Deliver Here
                </div>
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="w-4 h-1.5 bg-slate-900/40 rounded-full blur-[1px] mt-0.5"></div>
              </div>

              {/* Map grid simulation detail */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
                <p className="font-extrabold text-slate-900 leading-tight">{mapLocationName}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Latitude: {pinPosition.lat.toFixed(4)}, Longitude: {pinPosition.lng.toFixed(4)}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMapModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLocationFromMap}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Confirm This Location
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
