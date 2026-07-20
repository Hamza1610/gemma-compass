"use client";

import React from "react";
import { User, Compass } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  language: string;
  createdAt: string;
}

export default function ChatBubble({ role, content, language, createdAt }: ChatBubbleProps) {
  const isUser = role === "user";
  
  // Format timestamp (HH:MM)
  const timeStr = React.useMemo(() => {
    try {
      const date = new Date(createdAt);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }, [createdAt]);

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4 items-start gap-3`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md shrink-0">
          <Compass className="w-5 h-5" />
        </div>
      )}

      {/* Message Bubble */}
      <div className="flex flex-col max-w-[75%] space-y-1">
        {/* Bubble body */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10"
              : "glass-card text-gray-100 rounded-tl-none border-border"
          }`}
        >
          {/* Content */}
          <p className="whitespace-pre-wrap font-sans">{content}</p>
        </div>

        {/* Timestamp & Meta */}
        <div className={`flex items-center text-[10px] text-gray-500 gap-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
          <span>{timeStr}</span>
          {!isUser && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400 uppercase">
                {language === "mixed" ? "Mixed (Code-Switching)" : language}
              </span>
            </>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}
