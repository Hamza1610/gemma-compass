"use client";

import React, { useState } from "react";
import { Settings2, HardDrive, Cpu, WifiOff, Trash2, Database, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const simulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto h-full flex flex-col space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Settings2 className="w-8 h-8 mr-3 text-slate-800" />
          Edge Node Configuration
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your local Gemma model settings and offline knowledge cache.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gemma Engine Configuration */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mr-4">
              <Cpu className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Local Engine</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Active LLM Model</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none">
                <option>Gemma 4 (4-bit Quantized) - Local</option>
                <option>Gemma 2 (2b Parameter) - Local</option>
                <option>Cloud Engine (Requires Internet)</option>
              </select>
              <p className="mt-2 text-xs text-gray-500">The 4-bit quantized model is optimized for low-end mobile devices and runs entirely offline.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Aggressive Caching</h4>
                <p className="text-xs text-gray-500">Saves battery by limiting active inference threads.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <button 
              onClick={simulateSync}
              disabled={isSyncing}
              className="w-full flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing with Mesh..." : "Force Mesh Network Sync"}
            </button>
          </div>
        </div>

        {/* Offline Storage Manager */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mr-4">
                <HardDrive className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Offline Storage</h2>
            </div>
            <WifiOff className="w-5 h-5 text-gray-400" />
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-900">120 MB Used</span>
              <span className="text-gray-500 font-medium">1.0 GB Available</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: "12%" }}></div>
              <div className="bg-purple-400 h-full" style={{ width: "8%" }}></div>
            </div>
            <div className="flex space-x-4 mt-3 text-xs font-medium text-gray-500">
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-600 mr-2"></div>Roadmaps (72MB)</div>
              <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>Models (48MB)</div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2 flex items-center">
              <Database className="w-4 h-4 mr-2 text-gray-400" />
              Cached Modules
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">COSC 301 Roadmap</h4>
                  <p className="text-xs text-gray-500">Saved 2 days ago • 14MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">CHEM 201 Past Questions</h4>
                  <p className="text-xs text-gray-500">Saved 1 week ago • 45MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Gemma Chat History</h4>
                  <p className="text-xs text-gray-500">Auto-saved • 13MB</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
