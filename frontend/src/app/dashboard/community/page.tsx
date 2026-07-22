"use client";

import React, { useState } from "react";
import { Users, Search, Share2, Plus, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");

  const sharedRoadmaps = [
    {
      title: "COSC 301: Operating Systems (Full PQ Solved)",
      author: "Usman Bello",
      department: "Computer Science",
      likes: 124,
      downloads: 45
    },
    {
      title: "CHEM 201: Organic Chemistry Structures",
      author: "Aisha Mohammed",
      department: "Chemistry",
      likes: 89,
      downloads: 22
    },
    {
      title: "MATH 101: Calculus Basics + Formulas",
      author: "David O.",
      department: "Mathematics",
      likes: 210,
      downloads: 134
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto h-full flex flex-col space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Departmental Groups
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Share and download processed Knowledge Roadmaps via the Local Mesh.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab("feed")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "feed" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Study Feed
          </button>
          <button 
            onClick={() => setActiveTab("leaderboard")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "leaderboard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeTab === "feed" ? (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search for a course code (e.g., COSC 301)..." 
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            <div className="space-y-4">
              {sharedRoadmaps.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full mb-2 inline-block">
                        {item.department}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Shared by <span className="font-medium text-gray-700">{item.author}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center"><Share2 className="w-4 h-4 mr-1" /> {item.likes}</span>
                    </div>
                    <button className="flex items-center bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Journey
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar (Quick Stats) */}
          <div className="w-full lg:w-72 space-y-6">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
              <h3 className="font-bold text-lg mb-2">Share Your Knowledge</h3>
              <p className="text-sm text-blue-100 mb-6">
                Processed a 50-page PDF? Share it with the mesh network so others don't have to wait.
              </p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm">
                Share Roadmap
              </button>
            </div>
          </div>
          
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">ABU Contributors</h2>
          <p className="text-center text-gray-500 mb-8">Top students who shared the most Knowledge Roadmaps this week.</p>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5].map((pos) => (
              <div key={pos} className="flex items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full mr-4 ${
                  pos === 1 ? "bg-yellow-100 text-yellow-700" :
                  pos === 2 ? "bg-gray-100 text-gray-700" :
                  pos === 3 ? "bg-orange-100 text-orange-700" :
                  "bg-slate-50 text-slate-500"
                }`}>
                  {pos}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Student {pos}</h4>
                  <p className="text-xs text-gray-500">{30 - pos * 3} Roadmaps Shared</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
