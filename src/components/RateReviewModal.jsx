import React, { useState } from 'react';
import { db } from '../db/database';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export function RateReviewModal({ order, onCompleted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('Great quality produce and smooth transaction!');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.reviews.add({
        orderId: order ? order.id : 1,
        rating: rating,
        comment: comment,
        reviewerName: 'Aniket Sharma',
        reviewerRole: 'Buyer',
        targetName: order ? order.farmerName : 'Ramesh Patil',
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
      confetti({ particleCount: 80, spread: 60 });
      setTimeout(() => {
        onCompleted();
      }, 1500);
    } catch (err) {
      console.error('Review submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8 text-center">
        
        <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Step 8: Rate & Review</span>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Rate Your Experience</h2>
        <p className="text-slate-500 text-xs mt-1">Help build trust in the agricultural community.</p>

        {submitted ? (
          <div className="py-8 space-y-3">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-10 h-10 fill-amber-500" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Thank You!</h3>
            <p className="text-xs font-semibold text-slate-500">Your review for {order ? order.farmerName : 'Ramesh Patil'} has been published.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* Target Farmer Profile */}
            <div className="flex flex-col items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Farmer"
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600"
              />
              <h4 className="font-extrabold text-slate-900 text-base">{order ? order.farmerName : 'Ramesh Patil'}</h4>
              <p className="text-xs text-slate-500">Produce: {order ? order.cropName : 'Tomatoes'}</p>
            </div>

            {/* Interactive Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Comment Area */}
            <div>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding produce quality, weight accuracy..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
