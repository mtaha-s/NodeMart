import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";

export default function PurchaseInvoice() {

  return (
    <div className=" bg-gray-100 h-screen font-sans">
      <p className="text-gray-600 mb-4">Manage purchase invoices and orders</p>

      {/* Main Content */}
      <div className="bg-white p-8 rounded-xl shadow">
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Purchase Invoice Module</h2>
          <p className="text-gray-600 text-center max-w-md">
            This feature is under development. You'll be able to create and manage purchase invoices here.
          </p>
        </div>
      </div>
    </div>
  );
}