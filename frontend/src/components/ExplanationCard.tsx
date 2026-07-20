"use client";

import React, { useState } from "react";
import { BookOpen, BookCheck, Languages } from "lucide-react";

interface ExplanationCardProps {
  name: string;
  explanationEn: string;
  explanationHa: string;
  orderIndex: number;
}

export default function ExplanationCard({
  name,
  explanationEn,
  explanationHa,
  orderIndex,
}: ExplanationCardProps) {
  const [activeTab, setActiveTab] = useState<"both" | "en" | "ha">("both");

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col space-y-4 hover:border-primary/20">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-mono text-sm font-bold">
            {orderIndex + 1}
          </div>
          <h3 className="font-semibold text-lg text-white">{name}</h3>
        </div>

        {/* View Segmented Toggle */}
        <div className="bg-white/5 border border-white/10 p-0.5 rounded-lg flex text-[10px]">
          <button
            onClick={() => setActiveTab("both")}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === "both" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Bilingual
          </button>
          <button
            onClick={() => setActiveTab("en")}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === "en" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setActiveTab("ha")}
            className={`px-2 py-1 rounded-md transition-colors ${
              activeTab === "ha" ? "bg-primary text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            HA
          </button>
        </div>
      </div>

      {/* Explanations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Box */}
        {(activeTab === "both" || activeTab === "en") && (
          <div
            className={`p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col space-y-2 ${
              activeTab === "en" ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <BookOpen className="w-3.5 h-3.5" /> ENGLISH TUTOR
            </div>
            <p className="text-sm text-gray-300 leading-relaxed font-sans">
              {explanationEn}
            </p>
          </div>
        )}

        {/* Hausa Box */}
        {(activeTab === "both" || activeTab === "ha") && (
          <div
            className={`p-4 rounded-xl border border-primary/5 bg-primary/[0.01] flex flex-col space-y-2 ${
              activeTab === "ha" ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-secondary font-medium">
              <Languages className="w-3.5 h-3.5" /> HARSHE (HAUSA)
            </div>
            <p className="text-sm text-gray-200 leading-relaxed font-sans italic">
              {explanationHa}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
