'use client';

import React, { useState } from 'react';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight, ShieldCheck, CheckCircle2, LogIn, UserPlus, X, ArrowLeft } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: 'ramesh@farmer.com',
    password: 'password123',
    role: 'Farmer',
    phone: '',
    location: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload = {
        action: isRegistering ? 'register' : 'login',
        ...formData
      };

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setSuccessMsg(data.message);
      // Store real token & user session in localStorage
      localStorage.setItem('kissan_auth_token', data.token);
      localStorage.setItem('kissan_user', JSON.stringify(data.user));

      setTimeout(() => {
        onAuthSuccess(data.user);
        onClose();
      }, 1000);

    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 relative">
        
        {/* Top Action Bar with Back & Close Cancel Buttons */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          {/* Back Button (If in Registration Mode) */}
          {isRegistering ? (
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="pointer-events-auto px-3 py-1.5 bg-slate-900/60 hover:bg-slate-900 text-white rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-1 transition-all shadow-md"
              title="Back to Sign In"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {/* Cancel / Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto p-1.5 bg-slate-900/60 hover:bg-rose-600 text-white rounded-xl backdrop-blur-md transition-all shadow-md flex items-center gap-1 text-xs font-bold px-2.5"
            title="Cancel and Close"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 pt-12 text-center relative">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-2 text-emerald-300 shadow-inner">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Kisan Bazaar Server Authentication</h2>
          <p className="text-xs text-emerald-200 mt-0.5">Secure server database sign-in for farmers & buyers</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Quick Demo Pre-fill Pill Bar */}
          <div className="bg-slate-100 p-1.5 rounded-xl flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span>Quick Demo Fill:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setFormData({ ...formData, email: 'ramesh@farmer.com', password: 'password123', role: 'Farmer' });
                }}
                className="px-2 py-1 bg-emerald-600 text-white rounded-lg"
              >
                Farmer Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setFormData({ ...formData, email: 'aniket@buyer.com', password: 'password123', role: 'Buyer' });
                }}
                className="px-2 py-1 bg-amber-600 text-white rounded-lg"
              >
                Buyer Account
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Registration Extra Fields */}
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Account Role *</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Farmer' })}
                className={`py-2 text-xs font-extrabold rounded-xl border-2 transition-all ${
                  formData.role === 'Farmer' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                }`}
              >
                🌾 Farmer Mode
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'Buyer' })}
                className={`py-2 text-xs font-extrabold rounded-xl border-2 transition-all ${
                  formData.role === 'Buyer' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'
                }`}
              >
                🛒 Buyer Mode
              </button>
            </div>
          </div>

          {/* Registration extra phone & location */}
          {isRegistering && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Nashik, MH"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Form Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {loading ? 'Authenticating...' : isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          {/* Toggle Register/Login */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              {isRegistering ? 'Already have an account? Sign In' : 'New to Kisan Bazaar? Create Account'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
