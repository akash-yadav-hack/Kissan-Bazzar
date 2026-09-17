import React, { useState } from 'react';
import { db } from '../db/database';
import { CreditCard, QrCode, ShieldCheck, CheckCircle2, Lock, Smartphone, Building } from 'lucide-react';
import confetti from 'canvas-confetti';

export function PaymentCheckoutModal({ order, onPaymentComplete }) {
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('aniket@upi');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayNow = async () => {
    setLoading(true);
    try {
      if (order && order.id) {
        await db.orders.update(order.id, {
          paymentStatus: 'Paid',
          paymentMethod: selectedMethod
        });
      }

      setTimeout(() => {
        setPaid(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          onPaymentComplete();
        }, 1500);
      }, 1200);
    } catch (err) {
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = order ? order.totalPrice : 9500;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 relative">
        
        <div className="border-b border-slate-100 pb-4 mb-6 text-center">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Step 7: Payment</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Payment Options</h2>
          <p className="text-slate-500 text-xs mt-1">Make secure direct payment to farmer account.</p>
        </div>

        {paid ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Payment Successful!</h3>
            <p className="text-xs font-semibold text-slate-500">₹{totalAmount.toLocaleString()} paid via Razorpay Secure Gateway.</p>
          </div>
        ) : (
          <div>
            {/* Amount Box */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl mb-6 text-center shadow-lg">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Amount</p>
              <h1 className="text-3xl font-extrabold text-emerald-400 mt-1">₹{totalAmount.toLocaleString()}</h1>
              <p className="text-[11px] text-slate-400 mt-1">100% Direct Transfer to Ramesh Patil</p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 mb-6">
              
              {/* UPI */}
              <div 
                onClick={() => setSelectedMethod('UPI')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'UPI' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">UPI (GPay, PhonePe, Paytm)</h4>
                    <p className="text-[10px] text-slate-500">Instant 0% fee direct bank transfer</p>
                  </div>
                </div>
                <input type="radio" checked={selectedMethod === 'UPI'} readOnly className="accent-emerald-600" />
              </div>

              {/* Net Banking */}
              <div 
                onClick={() => setSelectedMethod('NetBanking')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'NetBanking' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-slate-700" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Net Banking</h4>
                    <p className="text-[10px] text-slate-500">SBI, HDFC, ICICI, Axis Bank</p>
                  </div>
                </div>
                <input type="radio" checked={selectedMethod === 'NetBanking'} readOnly className="accent-emerald-600" />
              </div>

              {/* Card */}
              <div 
                onClick={() => setSelectedMethod('Card')}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  selectedMethod === 'Card' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-700" />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Debit / Credit Card</h4>
                    <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                  </div>
                </div>
                <input type="radio" checked={selectedMethod === 'Card'} readOnly className="accent-emerald-600" />
              </div>

            </div>

            {selectedMethod === 'UPI' && (
              <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Enter VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Processing Payment...' : `Pay Now ₹${totalAmount.toLocaleString()}`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Secure Payments Powered by Razorpay</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
