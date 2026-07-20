"use client";

import React from "react";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  currentPref: string;
  onChange: (pref: string) => void;
}

export default function LanguageToggle({ currentPref, onChange }: LanguageToggleProps) {
  const options = [
    { value: "en", label: "English Only", desc: "Tutor speaks English" },
    { value: "mixed", label: "Hausa / English Mixed", desc: "Nigerian Code-Switching" },
    { value: "ha", label: "Hausa Only", desc: "Tutor speaks pure Hausa" },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-primary" /> Learning Language Mode
      </label>
      <div className="glass-panel p-1 rounded-xl flex w-full max-w-md">
        {options.map((opt) => {
          const isActive = currentPref === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 text-center py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
