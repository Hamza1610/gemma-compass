"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Upload, 
  MessageSquare, 
  CheckCircle2, 
  User, 
  Menu,
  Wifi,
  Settings,
  Users
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [ping, setPing] = useState(12);

  // Simulate a live connection ping for the Edge Node
  useEffect(() => {
    const interval = setInterval(() => {
      setPing(Math.floor(Math.random() * 5) + 10);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: "/dashboard", icon: <Home className="w-5 h-5" />, label: "Home" },
    { href: "/dashboard/upload", icon: <Upload className="w-5 h-5" />, label: "Upload" },
    { href: "/dashboard/study", icon: <MessageSquare className="w-5 h-5" />, label: "Tutor" },
    { href: "/dashboard/community", icon: <Users className="w-5 h-5" />, label: "Community" },
    { href: "/dashboard/quiz", icon: <CheckCircle2 className="w-5 h-5" />, label: "Quiz" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
          <span className="ml-3 font-bold text-gray-900 tracking-tight">Compass</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                pathname === item.href 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link href="/dashboard/settings" className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors ${
            pathname === '/dashboard/settings' 
              ? "bg-slate-100 text-slate-900 font-medium" 
              : "text-gray-600 hover:bg-gray-50"
          }`}>
            <Settings className="w-5 h-5" />
            <span className="ml-3">Settings</span>
          </Link>
          <Link href="/dashboard/profile" className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors ${
            pathname === '/dashboard/profile' 
              ? "bg-blue-50 text-blue-600 font-medium" 
              : "text-gray-600 hover:bg-gray-50"
          }`}>
            <User className="w-5 h-5" />
            <span className="ml-3">Profile</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          
          {/* Mobile Logo / Menu */}
          <div className="flex items-center md:hidden">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 font-bold text-gray-900 tracking-tight">Compass</span>
          </div>

          {/* Spacer for desktop */}
          <div className="hidden md:block"></div>

          {/* Edge Node Status & Profile */}
          <div className="flex items-center space-x-4">
            
            {/* The Hackathon Winning Feature: Edge Node Status */}
            <div className="hidden sm:flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-semibold text-green-700 flex items-center">
                Edge Node Connected <span className="text-green-500/50 mx-1">|</span> {ping}ms
              </span>
            </div>

            <div className="sm:hidden flex items-center space-x-1 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-green-700">{ping}ms</span>
            </div>

            <Link href="/dashboard/settings" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors">
              <Settings className="w-4 h-4" />
            </Link>
            <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200 hover:bg-blue-200 transition-colors">
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden absolute bottom-0 w-full h-[80px] bg-white border-t border-gray-200 flex items-center justify-around px-2 z-50 rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center space-y-1 w-16 group pt-2"
            >
              <div className={`${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
