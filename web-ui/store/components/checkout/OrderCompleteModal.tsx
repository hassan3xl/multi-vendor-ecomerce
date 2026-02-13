import React from "react";

import { CheckCircle2 } from "lucide-react";
interface OrderCompleteModalProps {}
const OrderCompleteModal = ({}: OrderCompleteModalProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-muted rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">
          Order Confirmed!
        </h1>
        <p className="text-primary mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        <div className="border border-border-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-1">Order Number</p>
          <p className="text-xl font-bold text-primary">
            #ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderCompleteModal;
