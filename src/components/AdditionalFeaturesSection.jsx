import React, { useState, useEffect } from 'react';
import { db } from '../db/database';
import { TrendingUp, Bell, Sun, Users, FileText, HelpCircle, ArrowUpRight, ArrowDownRight, Minus, PlusCircle, Check } from 'lucide-react';

export function AdditionalFeaturesSection() {
  const [activeTab, setActiveTab] = useState('insights');
  const [marketPrices, setMarketPrices] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newTargetCrop, setNewTargetCrop] = useState('Tomato');
  const [newTargetPrice, setNewTargetPrice] = useState('18');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prices = await db.marketPrices.toArray();
    const posts = await db.communityPosts.toArray();
    const alertList = await db.priceAlerts.toArray();
    setMarketPrices(prices);
    setCommunityPosts(posts);
    setAlerts(alertList);
  };

  const handleAddAlert = async (e) => {
    e.preventDefault();
    await db.priceAlerts.add({
      buyerId: 2,
      cropName: newTargetCrop,
      targetPrice: Number(newTargetPrice),
      isTriggered: false,
      createdAt: new Date().toISOString()
    });
    loadData();
  };

  return (
    <div className="bg-slate-100 py-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Value-Added Modules</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Additional Features & Tools</h2>
          <p className="text-slate-500 text-xs mt-1">Market intelligence, weather advisories, community support & government initiatives.</p>
        </div>

        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'insights' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Market Insights
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'alerts' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            Price Alerts
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'weather' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sun className="w-4 h-4" />
            Weather Forecast
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'community' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Farmer Community
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'schemes' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Govt Schemes
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'help' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            Support & Helpline
          </button>

        </div>

        {/* Tab 1: Market Insights */}
        {activeTab === 'insights' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Live Mandi Market Rates (APMC Benchmark)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                    <th className="p-3">Crop</th>
                    <th className="p-3">Mandi / District</th>
                    <th className="p-3">Min Rate</th>
                    <th className="p-3">Max Rate</th>
                    <th className="p-3">Modal Price</th>
                    <th className="p-3">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {marketPrices.map((mp) => (
                    <tr key={mp.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-extrabold text-slate-900">{mp.cropName}</td>
                      <td className="p-3 text-slate-500">{mp.mandi} ({mp.state})</td>
                      <td className="p-3">₹{mp.minPrice}/kg</td>
                      <td className="p-3">₹{mp.maxPrice}/kg</td>
                      <td className="p-3 font-extrabold text-emerald-700">₹{mp.modalPrice}/kg</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                          mp.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : mp.trend === 'down' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {mp.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : mp.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                          {mp.trend.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Price Alerts */}
        {activeTab === 'alerts' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-w-xl">
            <h3 className="font-extrabold text-slate-900 text-base mb-2">Set Price Alert Notifications</h3>
            <p className="text-xs text-slate-500 mb-4">Get instant SMS & App notifications when farmers list crops at your target rate.</p>

            <form onSubmit={handleAddAlert} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Crop name"
                value={newTargetCrop}
                onChange={(e) => setNewTargetCrop(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
              <input
                type="number"
                placeholder="Target ₹/kg"
                value={newTargetPrice}
                onChange={(e) => setNewTargetPrice(e.target.value)}
                className="w-28 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm">
                Add Alert
              </button>
            </form>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Active Alerts</h4>
              {alerts.map((al) => (
                <div key={al.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between text-xs font-bold text-emerald-950">
                  <span>{al.cropName}</span>
                  <span>Target: ₹{al.targetPrice}/kg</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Weather Updates */}
        {activeTab === 'weather' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-4">Farming Weather & Advisory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { day: 'Today', temp: '28°C', cond: 'Sunny / Mild Humidity', advisory: 'Ideal day for harvesting tomatoes.' },
                { day: 'Fri', temp: '27°C', cond: 'Light Rain Expected', advisory: 'Cover open grain storage bags.' },
                { day: 'Sat', temp: '29°C', cond: 'Clear Sky', advisory: 'Favorable for pesticide spraying.' },
                { day: 'Sun', temp: '30°C', cond: 'Sunny', advisory: 'Good transport conditions.' },
                { day: 'Mon', temp: '26°C', cond: 'Partly Cloudy', advisory: 'Normal irrigation schedule.' }
              ].map((w, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                  <span className="text-xs font-extrabold text-slate-500 block">{w.day}</span>
                  <Sun className="w-7 h-7 text-amber-500 mx-auto" />
                  <span className="text-lg font-extrabold text-slate-900 block">{w.temp}</span>
                  <p className="text-[10px] font-bold text-emerald-700">{w.cond}</p>
                  <p className="text-[10px] text-slate-500 leading-tight pt-1">{w.advisory}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Community */}
        {activeTab === 'community' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Agri-Community Knowledge Sharing</h3>
            {communityPosts.map((post) => (
              <div key={post.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-extrabold text-emerald-700">{post.authorName} ({post.authorRole})</span>
                  <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{post.title}</h4>
                <p className="text-xs text-slate-600">{post.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Schemes */}
        {activeTab === 'schemes' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-emerald-950 text-sm">PM-KISAN Samman Nidhi</h4>
              <p className="text-xs text-slate-600">Financial benefit of ₹6,000 per year in three equal installments to all landholding farmer families.</p>
              <a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 underline block">Apply on PM-KISAN Portal →</a>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-emerald-950 text-sm">Pradhan Mantri Fasal Bima Yojana</h4>
              <p className="text-xs text-slate-600">Comprehensive crop insurance coverage against non-preventable natural risks from pre-sowing to post-harvest.</p>
              <a href="https://pmfby.gov.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 underline block">PMFBY Portal →</a>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h4 className="font-extrabold text-emerald-950 text-sm">Soil Health Card Scheme</h4>
              <p className="text-xs text-slate-600">Provides information to farmers on nutrient status of their soil along with recommendation on appropriate dosage of nutrients.</p>
              <a href="https://soilhealth.dac.gov.in" target="_blank" rel="noreferrer" className="text-xs font-bold text-emerald-700 underline block">View Soil Card Guidelines →</a>
            </div>
          </div>
        )}

        {/* Tab 6: Help */}
        {activeTab === 'help' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center max-w-xl mx-auto space-y-3">
            <h3 className="font-extrabold text-slate-900 text-lg">Kisan Bazaar Support & Helpline</h3>
            <p className="text-xs text-slate-500">Free Toll-Free Multilingual Assistance for Farmers & Buyers</p>
            <div className="p-4 bg-emerald-600 text-white rounded-xl text-xl font-extrabold inline-block shadow-md">
              📞 1800-180-1551
            </div>
            <p className="text-[11px] text-slate-400">Available 24/7 in Hindi, Marathi, Gujarati, Punjabi, Telugu, & English</p>
          </div>
        )}

      </div>
    </div>
  );
}
