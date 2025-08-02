// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Bell, User, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Swal from 'sweetalert2';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Donor Search", href: "/search" },
  ];

  // Add donor registration only if user is authenticated
  if (session) {
    navItems.push({ name: "Become a Donor", href: "/register" });
  }

  useEffect(() => {
    if (session) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data.notifications);
          setUnreadCount(data?.notifications?.filter((n: any) => !n.read).length);
        });
    }
  }, [session]);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev: any) =>
      prev.map((n: any) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => prev - 1);
  };

  const handleSignOut = async () => {
    const result = await Swal.fire({
      title: 'Are you sure you want to sign out?',
      text: "You'll need to sign in again to access your account.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, sign out',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'rounded-md',
        cancelButton: 'rounded-md'
      }
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-normalRed flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900">BloodLife</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-600 hover:text-normalRed transition-colors duration-200
                  ${item.name.includes("Donor") ? "font-medium" : ""}`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* User Menu */}
            {session ? (
              <>
                {/* Notification Bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-6 w-6" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-normalRed text-white text-xs rounded-full px-1.5 py-0.5">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications?.length === 0 && (
                      <DropdownMenuItem>No notifications</DropdownMenuItem>
                    )}
                    {notifications?.map((n: any) => (
                      <DropdownMenuItem
                        key={n._id}
                        onClick={() => markAsRead(n._id)}
                        className={n.read ? "" : "font-bold bg-lightRed"}
                      >
                        {n.message}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/authentication/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/authentication/signup">
                  <Button className="bg-normalRed hover:bg-darkRed">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-normalRed text-white text-xs rounded-full px-1.5 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications?.length === 0 && (
                    <DropdownMenuItem>No notifications</DropdownMenuItem>
                  )}
                  {notifications?.map((n: any) => (
                    <DropdownMenuItem
                      key={n._id}
                      onClick={() => markAsRead(n._id)}
                      className={n.read ? "" : "font-bold bg-lightRed"}
                    >
                      {n.message}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-normalRed hover:bg-lightRed transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-normalRed hover:bg-lightRed transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-normalRed hover:bg-lightRed transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/authentication/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-normalRed hover:bg-lightRed transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/authentication/signup"
                    className="block px-3 py-2 rounded-md text-base font-medium text-normalRed hover:text-darkRed hover:bg-lightRed transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
