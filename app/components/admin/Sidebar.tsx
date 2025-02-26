"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Package, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-3 bg-gray-800 text-white rounded-md fixed top-4 left-4 z-50"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white w-64 p-6 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:relative md:w-64`}
      >
        <h2 className="text-xl font-bold mb-6">🛠️ Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700"
          >
            <Package size={20} />
            <span>პროდუქტები</span>
          </Link>
        </nav>
      </aside>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
        />
      )}
    </div>
  );
}
