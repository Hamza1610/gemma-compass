"use client";

import React from "react";
import { Home, BookOpen, PenTool, Users, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:max-w-[428px] mx-auto min-h-screen bg-gray-50 relative shadow-2xl flex flex-col overflow-hidden border-x border-gray-200">
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-24 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 w-full h-[88px] bg-white border-t border-gray-100 flex items-center justify-around px-2 z-50 rounded-t-[32px] shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
        <NavItem icon={<Home className="w-6 h-6" />} label="Home" active />
        <NavItem icon={<BookOpen className="w-6 h-6" />} label="Learn" />
        <NavItem icon={<PenTool className="w-6 h-6" />} label="Study" />
        <NavItem icon={<Users className="w-6 h-6" />} label="Community" />
        <NavItem icon={<User className="w-6 h-6" />} label="Profile" />
      </nav>

    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button className="flex flex-col items-center justify-center space-y-1 w-16 group pt-2">
      <div className={`${active ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}>
        {icon}
      </div>
      <span className={`text-[10px] font-medium ${active ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"} transition-colors`}>
        {label}
      </span>
    </button>
  );
}
