import React from "react";
import { Package, Users, ShoppingCart, Lock, Code, Database } from "lucide-react";

export default function About() {
  const technologies = [
    "Node.js",
    "Express",
    "React",
    "MongoDB",
    "JavaScript",
    "Tailwind CSS",
    "React Router",
    "Vite",
  ];

  const features = [
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track and manage all your inventory items with detailed information and real-time updates.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Vendor Management",
      description: "Maintain comprehensive vendor information and manage your supplier relationships.",
      color: "text-green-600",
    },
    {
      icon: ShoppingCart,
      title: "Purchase Invoices",
      description: "Create and manage purchase invoices with ease and accuracy.",
      color: "text-yellow-600",
    },
    {
      icon: Lock,
      title: "Role-Based Access",
      description: "Secure authentication with role-based access control for different user types.",
      color: "text-red-600",
    },
  ];

  return (
    <div className="p-2 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">About NodeMart</h1>
      <p className="text-gray-600 mb-6">Learn more about our inventory management system</p>

      {/* What is NodeMart Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">What is NodeMart?</h2>
        <p className="text-gray-700 leading-relaxed">
          NodeMart is a comprehensive inventory management system designed to help businesses efficiently track and manage their inventory, vendors, and purchase orders. Built with modern technologies including Node.js, Express, React, and MongoDB, NodeMart provides a professional and intuitive interface for all your inventory needs.
        </p>
      </div>

      {/* Key Features Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex gap-4">
                <div className="shrink-0">
                  <IconComponent className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech) => (
            <div key={tech} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center hover:bg-gray-100 transition">
              <p className="text-gray-800 font-medium text-sm">{tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Version Information Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Version Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-gray-600">Version</span>
            <span className="font-semibold text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-semibold text-gray-900">February 2026</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">License</span>
            <a href="#" className="font-semibold text-blue-600 hover:underline">SYSTEMS</a>
          </div>
        </div>
      </div>
    </div>
  );
}