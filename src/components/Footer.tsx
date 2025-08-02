// components/Footer.tsx
import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-1">
              <div className="w-8 relative  overflow-hidden h-8 rounded-full flex items-center justify-center">
                <Image src="/logo.png" alt="BloodLife Logo" fill />
              </div>
              <span className="text-xl font-bold text-white">BloodLife</span>
            </div>
            <p className="text-sm">
              Connecting donors with those in need. Every drop counts in saving
              lives.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-normalRed transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-normalRed transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-normalRed transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Donor Register", href: "/register" },
                { label: "Donor Search", href: "/search" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-normalRed transition-colors text-sm inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-normalRed" />
                <span>Emergency: +1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-normalRed" />
                <span>support@bloodlife.org</span>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-normalRed mt-1 flex-shrink-0" />
                <span>
                  123 Blood Center Street
                  <br />
                  Medical District
                  <br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Stay Updated
            </h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for updates on blood drives and donor
              opportunities.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-normalRed text-sm"
              />
              <button
                type="submit"
                className="w-full bg-normalRed hover:bg-darkRed text-white py-2 rounded transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">© 2025 BloodLife. All rights reserved.</p>
            <div className="flex items-center space-x-2 text-sm">
              <Heart className="w-4 h-4 text-normalRed" />
              <span>Made with love for humanity</span>
            </div>
            <div className="flex space-x-4 text-sm">
              <Link href="#" className="hover:text-normalRed transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-normalRed transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
