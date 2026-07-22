"use client";

import React from "react";
import Link from "next/link";
import { 
  BookOpen, 
  ArrowRight, 
  UploadCloud, 
  Map, 
  Clock,
  PlayCircle,
  CheckCircle2
} from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back, Usman!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Your local Edge Node is active. Ready to continue learning?
        </p>
      </div>

      {/* Gamification Stats Grid (Dark Theme UI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Streak Component */}
        <div className="bg-[#18181b] rounded-3xl p-6 shadow-md border border-[#27272a] flex flex-col justify-between">
          <div className="flex items-center space-x-6 mb-6">
            <div className="text-5xl">🔥</div>
            <div>
              <p className="text-4xl font-bold text-white leading-tight">0</p>
              <p className="text-[#a1a1aa] font-medium text-lg">Day Streak</p>
            </div>
          </div>
          
          <div className="border-t border-[#27272a] pt-6 mt-2">
            <div className="flex justify-between items-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#3f3f46] flex items-center justify-center"></div>
                  <span className="text-[#71717a] text-xs font-bold">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Spent Learning Line Chart */}
        <div className="bg-[#18181b] rounded-3xl p-6 shadow-md border border-[#27272a] flex flex-col">
          <h3 className="text-white font-semibold mb-6">Time Spent Learning</h3>
          <div className="flex-1 flex relative">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between text-[#71717a] text-[10px] pr-4 h-[120px]">
              <span>1.0</span>
              <span>0.8</span>
              <span>0.6</span>
              <span>0.4</span>
              <span>0.2</span>
              <span>0</span>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 relative h-[120px]">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0,1,2,3,4,5].map((_, i) => (
                  <div key={i} className="border-b border-[#27272a] w-full h-[1px]"></div>
                ))}
              </div>
              
              {/* SVG Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 0 120 L 50 120 L 100 120 L 150 120 L 200 120 L 250 120 L 300 120" stroke="#3b82f6" strokeWidth="2" fill="none" />
                {[0, 50, 100, 150, 200, 250, 300].map((cx, i) => (
                  <circle key={i} cx={cx} cy="120" r="3" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
                ))}
              </svg>
            </div>
          </div>
          
          {/* X Axis Labels */}
          <div className="flex justify-between text-[#71717a] text-[10px] pl-8 mt-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Weekly Progress Line Chart */}
        <div className="bg-[#18181b] rounded-3xl p-6 shadow-md border border-[#27272a] flex flex-col">
          <h3 className="text-white font-semibold mb-6">Weekly Progress</h3>
          <div className="flex-1 flex relative">
            {/* Y Axis Labels */}
            <div className="flex flex-col justify-between text-[#71717a] text-[10px] pr-4 h-[120px]">
              <span>1.0</span>
              <span>0.5</span>
              <span>0</span>
              <span>-0.5</span>
              <span>-1.0</span>
            </div>
            
            {/* Chart Area */}
            <div className="flex-1 relative h-[120px]">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0,1,2,3,4].map((_, i) => (
                  <div key={i} className="border-b border-[#27272a] w-full h-[1px]"></div>
                ))}
              </div>
              
              {/* SVG Line */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 0 60 L 50 60 L 100 60 L 150 60 L 200 60 L 250 60 L 300 60" stroke="#3b82f6" strokeWidth="2" fill="none" />
                {[0, 50, 100, 150, 200, 250, 300].map((cx, i) => (
                  <circle key={i} cx={cx} cy="60" r="3" fill="#18181b" stroke="#3b82f6" strokeWidth="1.5" />
                ))}
              </svg>
            </div>
          </div>
          
          {/* X Axis Labels */}
          <div className="flex justify-between text-[#71717a] text-[10px] pl-8 mt-3">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Active Study Journey (AKN) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Map className="w-5 h-5 mr-2 text-blue-500" />
            Current Study Journey
          </h2>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
              <span>Operating Systems 301</span>
              <span>•</span>
              <span>Module 2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Memory Management & Paging</h3>
            <p className="text-sm text-gray-600 mb-4 max-w-lg">
              You've mastered the basics of CPU Scheduling. Based on your last diagnostic quiz, Gemma recommends focusing on Paging algorithms next.
            </p>
            
            {/* Progress Bar */}
            <div className="flex items-center space-x-4 max-w-sm">
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: "45%" }}></div>
              </div>
              <span className="text-sm font-medium text-gray-600">45%</span>
            </div>
          </div>
          
          <Link 
            href="/dashboard/study" 
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-sm shadow-blue-200"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Resume Module</span>
          </Link>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Upload Card */}
        <Link href="/dashboard/upload" className="group block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <UploadCloud className="w-24 h-24 text-blue-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Process New Document</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Upload PDF lecture notes or images of whiteboard notes. Gemma will extract core concepts.
            </p>
          </div>
        </Link>

        {/* Generate Quiz Card */}
        <Link href="/dashboard/quiz" className="group block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
            <BookOpen className="w-24 h-24 text-purple-600" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Take Diagnostic Quiz</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Test your knowledge on recent modules to update your Adaptive Knowledge Roadmap.
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 flex items-center mb-4">
          <Clock className="w-5 h-5 mr-2 text-gray-500" />
          Recent Knowledge Modules
        </h2>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            
            {/* Item 1 */}
            <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">CPU Scheduling Algorithms.pdf</h4>
                  <p className="text-xs text-gray-500">Processed 2 days ago • 14 concepts extracted</p>
                </div>
              </div>
              <Link href="/dashboard/study" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                <span className="hidden sm:inline">Review</span>
                <ArrowRight className="w-4 h-4 sm:ml-1" />
              </Link>
            </div>

            {/* Item 2 */}
            <div className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Intro to Data Structures.pdf</h4>
                  <p className="text-xs text-gray-500">Processed 1 week ago • 22 concepts extracted</p>
                </div>
              </div>
              <Link href="/dashboard/study" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                <span className="hidden sm:inline">Review</span>
                <ArrowRight className="w-4 h-4 sm:ml-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
