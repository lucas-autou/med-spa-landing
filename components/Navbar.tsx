'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal to-teal-hover rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
            <span className="font-semibold text-text-primary">Virtual Spa</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-text-secondary hover:text-teal transition-colors">
              Features
            </a>
            <a href="#demo" className="text-text-secondary hover:text-teal transition-colors">
              Demo
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-teal transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-text-secondary hover:text-teal transition-colors">
              FAQ
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#hero"
              className="px-4 py-2 bg-teal hover:bg-teal-hover text-white rounded-lg font-medium transition-colors duration-200"
            >
              Try Demo
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-teal"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border-light py-4 space-y-4">
            <a
              href="#features"
              className="block text-text-secondary hover:text-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#demo"
              className="block text-text-secondary hover:text-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Demo
            </a>
            <a
              href="#pricing"
              className="block text-text-secondary hover:text-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="block text-text-secondary hover:text-teal transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#hero"
              className="block w-full text-center py-2 bg-teal hover:bg-teal-hover text-white rounded-lg font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Try Demo
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}