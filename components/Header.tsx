"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              FileConverter
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-red-600 transition">
              Home
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-red-600 transition">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-red-600 transition">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-red-600 transition">
              About
            </Link>
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              Sign In
            </button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-red-600 transition">
                Home
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-red-600 transition">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-red-600 transition">
                Pricing
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-red-600 transition">
                About
              </Link>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition w-full">
                Sign In
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
