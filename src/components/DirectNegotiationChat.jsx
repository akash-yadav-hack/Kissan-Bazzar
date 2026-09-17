'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../db/database';
import { MessageSquare, Send, CheckCheck, Sparkles, User, Tag, ArrowRight, Check, Info, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export function DirectNegotiationChat({ currentRole, targetListing, onProceedToOrder }) {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [showCropDetailsMobile, setShowCropDetailsMobile] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    initChat();
  }, [targetListing]);

  useEffect(() => {
    // Auto-scroll chat to bottom on new message
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initChat = async () => {
    let listingId = targetListing ? targetListing.id : 1;
    let listing = targetListing || (await db.listings.get(1));

    // Find existing chat or create new
    let chat = await db.chats.where('listingId').equals(listingId).first();
    if (!chat) {
      const chatId = await db.chats.add({
        listingId: listing.id,
        farmerId: listing.farmerId,
        buyerId: 2, // Aniket Sharma default
        cropName: listing.cropName,
        lastMessage: 'Negotiation started',
        updatedAt: new Date().toISOString()
      });

      // Seed initial messages matching template image!
      await db.messages.bulkAdd([
        {
          chatId: chatId,
          senderId: 2,
          senderRole: 'Buyer',
          text: `Hi! I am interested in purchasing 500 kg ${listing.cropName}. Can you do ₹18/kg?`,
          isOffer: true,
          offerPrice: 18,
          timestamp: '10:24 AM'
        },
        {
          chatId: chatId,
          senderId: listing.farmerId,
          senderRole: 'Farmer',
          text: `I can do ₹19/kg. Let me know if that works. Fresh harvest guaranteed!`,
          isOffer: true,
          offerPrice: 19,
          timestamp: '10:26 AM'
        }
      ]);

      chat = await db.chats.get(chatId);
    }

    setActiveChat(chat);
    loadMessages(chat.id);
  };

  const loadMessages = async (chatId) => {
    const msgList = await db.messages.where('chatId').equals(chatId).toArray();
    setMessages(msgList);
  };

  const handleSendMessage = async (isOfferMsg = false) => {
    if (!inputText && !isOfferMsg) return;
    if (!activeChat) return;

    const senderRole = currentRole;
    const senderId = currentRole === 'Farmer' ? activeChat.farmerId : activeChat.buyerId;

    const newMsg = {
      chatId: activeChat.id,
      senderId: senderId,
      senderRole: senderRole,
      text: isOfferMsg ? `I propose a price of ₹${offerPrice}/kg for this batch.` : inputText,
      isOffer: isOfferMsg,
      offerPrice: isOfferMsg ? Number(offerPrice) : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await db.messages.add(newMsg);
    await db.chats.update(activeChat.id, {
      lastMessage: newMsg.text,
      updatedAt: new Date().toISOString()
    });

    const sentText = newMsg.text;
    const currentOffer = isOfferMsg ? Number(offerPrice) : null;

    setInputText('');
    setOfferPrice('');
    loadMessages(activeChat.id);

    // Call Real AI Server API if Buyer sends a message or offer to Farmer
    if (senderRole === 'Buyer') {
      try {
        const aiRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cropName: targetListing ? targetListing.cropName : 'Fresh Tomatoes',
            listedPrice: targetListing ? targetListing.pricePerUnit : 20,
            userMessage: sentText,
            offerPrice: currentOffer
          })
        });

        const aiData = await aiRes.json();

        if (aiData && aiData.reply) {
          const aiReply = {
            chatId: activeChat.id,
            senderId: activeChat.farmerId,
            senderRole: 'Farmer',
            text: aiData.reply,
            isOffer: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          await db.messages.add(aiReply);
          loadMessages(activeChat.id);
        }
      } catch (err) {
        console.error('Error fetching AI response:', err);
      }
    }
  };

  const activeCropName = targetListing ? targetListing.cropName : 'Fresh Tomatoes';
  const activeCropPrice = targetListing ? targetListing.pricePerUnit : 20;

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      
      {/* Mobile Collapsible Crop Info Header */}
      <div className="md:hidden bg-white rounded-2xl border border-slate-200 p-3 mb-3 shadow-sm">
        <div 
          onClick={() => setShowCropDetailsMobile(!showCropDetailsMobile)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-extrabold text-slate-900">{activeCropName} (₹{activeCropPrice}/kg)</span>
          </div>
          <button className="text-xs font-bold text-emerald-700 flex items-center gap-1">
            {showCropDetailsMobile ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showCropDetailsMobile ? 'Hide Details' : 'View Crop Info'}
          </button>
        </div>

        {showCropDetailsMobile && targetListing && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
            <img src={targetListing.photoUrl} alt={targetListing.cropName} className="w-16 h-16 rounded-xl object-cover shrink-0" />
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-900">{targetListing.cropName}</p>
              <p className="text-slate-500">Farmer: {targetListing.farmerName} ({targetListing.farmerLocation})</p>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                {targetListing.qualityGrade}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col md:grid md:grid-cols-3 min-h-[550px] md:min-h-[600px]">
        
        {/* Left Side: Desktop Crop Details & Negotiated Price Summary */}
        <div className="hidden md:flex bg-slate-50 border-r border-slate-200 p-6 flex-col justify-between">
          <div>
            <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Step 4: Direct Negotiation</span>
            <h2 className="text-xl font-extrabold text-slate-900 mt-1">Live Chat & Offer</h2>
            <p className="text-slate-500 text-xs mt-1">Agree on final price directly with no agent commissions.</p>

            {targetListing && (
              <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <img src={targetListing.photoUrl} alt={targetListing.cropName} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">{targetListing.cropName}</h4>
                <div className="flex items-center justify-between text-xs mt-1 text-slate-600">
                  <span>Listed Price:</span>
                  <span className="font-extrabold text-slate-900">₹{targetListing.pricePerUnit}/kg</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1 text-slate-600">
                  <span>Farmer:</span>
                  <span className="font-semibold text-emerald-700">{targetListing.farmerName}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1 text-slate-600">
                  <span>Grade:</span>
                  <span className="font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">{targetListing.qualityGrade}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-200">
            <button
              onClick={() => onProceedToOrder(targetListing, 19)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept Agreed Price & Place Order (Step 5)
            </button>
          </div>
        </div>

        {/* Right Side: Fully Responsive Interactive Chat Room */}
        <div className="md:col-span-2 flex flex-col justify-between bg-white flex-1">
          
          {/* Chat Header */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                  alt="Farmer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-emerald-500"
                />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 absolute bottom-0 right-0 border-2 border-white pulse-online"></span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Ramesh Patil</h4>
                <p className="text-[10px] sm:text-[11px] font-semibold text-emerald-600">Online • Verified Farmer (Nashik)</p>
              </div>
            </div>
            
            <button
              onClick={() => onProceedToOrder(targetListing, 19)}
              className="md:hidden px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Place Order
            </button>
          </div>

          {/* Messages Container */}
          <div className="p-3 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4 max-h-[380px] sm:max-h-[420px] flex-1">
            {messages.map((msg) => {
              const isMe = msg.senderRole === currentRole;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-md p-3 sm:p-3.5 rounded-2xl text-xs font-medium shadow-sm ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                    
                    {msg.isOffer && (
                      <div className={`mt-2 p-2 rounded-lg flex items-center justify-between text-xs font-bold ${
                        isMe ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        <span>Proposed Price: ₹{msg.offerPrice}/kg</span>
                        <span className="text-[10px] underline cursor-pointer ml-2">Counter</span>
                      </div>
                    )}

                    <div className={`text-[9px] sm:text-[10px] mt-1 text-right ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Controls & Mobile Offer Bar */}
          <div className="p-2.5 sm:p-4 border-t border-slate-200 bg-slate-50 space-y-2">
            
            {/* Quick Price Counter Offer Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-600 shrink-0">Offer ₹/kg:</span>
              <input
                type="number"
                placeholder="₹/kg"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-20 sm:w-28 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage(true)}
                className="px-2.5 sm:px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs transition-colors shrink-0"
              >
                Send Offer
              </button>
            </div>

            {/* Main Text Input */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(false)}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendMessage(false)}
                className="p-2 sm:p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
