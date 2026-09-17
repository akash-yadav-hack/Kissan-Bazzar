import React, { useState, useEffect } from 'react';
import { db } from '../db/database';
import { Truck, CheckCircle2, Clock, MapPin, Package, ArrowRight, Star } from 'lucide-react';

export function OrderTracking({ currentRole, onRateOrder }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [currentRole]);

  const fetchOrders = async () => {
    const list = await db.orders.reverse().toArray();
    setOrders(list);
    if (list.length > 0 && !selectedOrder) {
      setSelectedOrder(list[0]);
    }
  };

  const advanceOrderStatus = async (orderId, newStatus) => {
    const order = await db.orders.get(orderId);
    if (!order) return;

    let history = [...order.trackingHistory];

    if (newStatus === 'Preparing Produce') {
      history[1] = { status: 'Preparing Produce', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true };
    } else if (newStatus === 'Out for Delivery') {
      history[2] = { status: 'Out for Delivery', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true };
    } else if (newStatus === 'Delivered') {
      history[3] = { status: 'Delivered', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true };
    }

    await db.orders.update(orderId, {
      orderStatus: newStatus,
      trackingHistory: history
    });

    fetchOrders();
    const updated = await db.orders.get(orderId);
    setSelectedOrder(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-emerald-600 text-xs font-bold uppercase tracking-wider">Step 6: Pickup / Delivery</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Live Order Tracking</h1>
          <p className="text-slate-500 text-xs mt-1">Track harvest dispatch and real-time delivery status.</p>
        </div>

        {currentRole === 'Farmer' && (
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold">
            Farmer Controls Active
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-300">
          <p className="text-slate-500 font-semibold text-sm">No orders placed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Order List */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Your Orders</h3>
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedOrder && selectedOrder.id === ord.id
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-extrabold text-slate-900 text-xs">Order #{ord.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {ord.orderStatus}
                  </span>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{ord.cropName} ({ord.quantity} {ord.unit})</h4>
                <div className="flex justify-between items-center text-xs mt-2 text-slate-500">
                  <span>Total: ₹{ord.totalPrice.toLocaleString()}</span>
                  <span className="text-[10px]">{ord.paymentStatus}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tracking Timeline Details */}
          {selectedOrder && (
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              
              <div>
                <div className="border-b border-slate-100 pb-4 mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">{selectedOrder.cropName}</h3>
                    <p className="text-xs font-semibold text-slate-500">Farmer: {selectedOrder.farmerName} • Buyer: {selectedOrder.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Paid</span>
                    <span className="text-xl font-extrabold text-emerald-700">₹{selectedOrder.totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* 4 Step Visual Timeline matching Template! */}
                <div className="space-y-6 relative ml-3 border-l-2 border-slate-200 pl-6 my-6">
                  {selectedOrder.trackingHistory.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Step Circle */}
                      <div className={`w-7 h-7 rounded-full absolute -left-[37px] top-0 flex items-center justify-center font-bold text-xs ${
                        step.completed
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.status}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 mt-4">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-900">Delivery Address:</span>
                      <p className="text-slate-600 mt-0.5">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Farmer Controls to Update Status */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2 justify-between items-center">
                {currentRole === 'Farmer' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Farmer Status Actions:</span>
                    <button
                      onClick={() => advanceOrderStatus(selectedOrder.id, 'Preparing Produce')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      Prepare Produce
                    </button>
                    <button
                      onClick={() => advanceOrderStatus(selectedOrder.id, 'Out for Delivery')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      Out for Delivery
                    </button>
                    <button
                      onClick={() => advanceOrderStatus(selectedOrder.id, 'Delivered')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Mark Delivered
                    </button>
                  </div>
                ) : (
                  <div>
                    {selectedOrder.orderStatus === 'Delivered' && (
                      <button
                        onClick={() => onRateOrder(selectedOrder)}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        Rate & Review Farmer (Step 8)
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
