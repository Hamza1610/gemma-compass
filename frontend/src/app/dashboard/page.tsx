"use client";

import React from "react";
import Image from "next/image";
import { Bell, Sparkles, MessageSquare, BookOpen, Clock, Target, Flame } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col px-6 pt-12 pb-6 space-y-8 bg-[#F8F9FA]">
      
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
            <Image 
              src="/images/ucee.jpg" 
              alt="Profile" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
              // Fallback to a gray circle if the image doesn't exist yet
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://ui-avatars.com/api/?name=Usman+Garba&background=0D8ABC&color=fff";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-sm">Hello,</span>
            <span className="font-bold text-gray-900 text-lg leading-tight">Usman Garba</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90 text-white px-3.5 py-1.5 rounded-full shadow-md shadow-blue-500/20 transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Go Pro</span>
          </button>
          
          <button className="relative w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              9+
            </div>
          </button>
        </div>
      </header>

      {/* Hero Card */}
      <div className="w-full relative h-[180px] rounded-[24px] overflow-hidden shadow-lg">
        {/* Background gradient/image placeholder */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" 
            alt="Students"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>
        
        <div className="absolute inset-0 p-6 flex flex-col justify-center">
          <p className="text-gray-300 text-xs mb-1 font-medium tracking-wide">Personalized learning paths for you.</p>
          <h2 className="text-white text-2xl font-bold mb-4">Excel in Your Studies</h2>
          <button className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white text-xs font-medium px-5 py-2 rounded-full w-max transition-colors">
            Explore Features
          </button>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5">
          <div className="w-4 h-1 rounded-full bg-blue-500"></div>
          <div className="w-1 h-1 rounded-full bg-white/30"></div>
          <div className="w-1 h-1 rounded-full bg-white/30"></div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="flex flex-col space-y-4">
        <h3 className="font-bold text-gray-900 text-lg">Quick Actions</h3>
        <div className="flex items-center justify-between gap-2">
          
          <ActionItem 
            icon={<MessageSquare className="w-6 h-6 text-purple-500" />} 
            label="AI Chat" 
            bg="bg-purple-50" 
          />
          <ActionItem 
            icon={<BookOpen className="w-6 h-6 text-green-500" />} 
            label="E-Library" 
            bg="bg-green-50" 
          />
          <ActionItem 
            icon={<Clock className="w-6 h-6 text-orange-400" />} 
            label="Timetable" 
            bg="bg-orange-50" 
          />
          <ActionItem 
            icon={<Target className="w-6 h-6 text-rose-500" />} 
            label="Goals" 
            bg="bg-rose-50" 
          />
          
        </div>
      </section>

      {/* Study Streak */}
      <section className="w-full bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col space-y-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900 text-lg">Study Streak</h3>
            <p className="text-gray-400 text-xs">Keep it up!</p>
          </div>
          <div className="flex items-center space-x-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span className="text-orange-500 text-xs font-bold">0 Days</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-1">
          <DayItem day="M" date="30" />
          <DayItem day="T" date="31" />
          <DayItem day="W" date="1" />
          <DayItem day="T" date="2" />
          <DayItem day="F" date="3" active />
          <DayItem day="S" date="4" />
          <DayItem day="S" date="5" />
        </div>
      </section>

      {/* Current Course */}
      <section className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">Current Course</h3>
          <button className="text-blue-500 text-sm font-medium flex items-center hover:text-blue-600 transition-colors">
            View All <span className="ml-0.5">›</span>
          </button>
        </div>
        
        <div className="w-full h-32 bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden relative">
           <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
              alt="Course"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
              IN PROGRESS
            </div>
        </div>
      </section>

    </div>
  );
}

function ActionItem({ icon, label, bg }: { icon: React.ReactNode; label: string; bg: string }) {
  return (
    <button className="flex flex-col items-center space-y-2 group">
      <div className={`w-[72px] h-[72px] ${bg} rounded-3xl flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95`}>
        {icon}
      </div>
      <span className="text-[11px] font-semibold text-gray-700">{label}</span>
    </button>
  );
}

function DayItem({ day, date, active = false }: { day: string; date: string; active?: boolean }) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-[10px] text-gray-400 font-medium">{day}</span>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
          : "bg-gray-50 text-gray-400 hover:bg-gray-100"
      }`}>
        {active && day === 'F' ? ( // Show a small lightning bolt instead of the date for the active mockup day, optional styling flair
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white fill-white"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        ) : (
          date
        )}
      </div>
    </div>
  );
}
