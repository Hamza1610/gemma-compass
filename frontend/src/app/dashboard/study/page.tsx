"use client";

import React, { useState } from "react";
import { Send, Globe, Zap, Book, ChevronRight } from "lucide-react";

export default function StudyTutorPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Sannu! I'm your Gemma Compass Tutor. I see you're studying 'Memory Management & Paging'. Would you like me to explain it in English or Hausa?",
      language: "mixed"
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessages([...messages, { role: "user", content: message, language: "en" }]);
    setMessage("");

    // Simulate Gemma backend response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Great question! In simple terms, **Paging** is like dividing a large textbook into equalsized chapters (Pages) so the computer (CPU) can read them easily without keeping the whole book on the desk (RAM). A Hausa, muna kiran wannan tsarin raba babban aiki zuwa kananan rabo don saukin gudanarwa.",
        language: "mixed"
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left Panel: Knowledge Roadmap */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-gray-900 flex items-center">
            <Book className="w-5 h-5 mr-2 text-blue-600" />
            Knowledge Roadmap
          </h2>
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">Module 2</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="relative border-l-2 border-blue-100 ml-3 space-y-8">
            
            <div className="relative">
              <div className="absolute -left-[1.06rem] top-1 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-sm"></div>
              <div className="pl-6">
                <h3 className="text-sm font-bold text-gray-900">CPU Scheduling</h3>
                <p className="text-xs text-gray-500 mt-1">Mastered via Diagnostic Quiz</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[1.06rem] top-1 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm animate-pulse"></div>
              <div className="pl-6 bg-blue-50 p-3 rounded-xl border border-blue-100 -mt-2">
                <h3 className="text-sm font-bold text-blue-900">Memory Management & Paging</h3>
                <p className="text-xs text-blue-700 mt-1 mb-2">Current Focus Area</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] bg-white px-2 py-1 rounded-full text-blue-600 border border-blue-100">Frames vs Pages</span>
                  <span className="text-[10px] bg-white px-2 py-1 rounded-full text-blue-600 border border-blue-100">Page Tables</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-[1.06rem] top-1 w-4 h-4 bg-gray-200 rounded-full border-4 border-white"></div>
              <div className="pl-6 opacity-50">
                <h3 className="text-sm font-bold text-gray-900">Virtual Memory</h3>
                <p className="text-xs text-gray-500 mt-1">Locked</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Panel: AKN Chat Interface */}
      <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
          <div>
            <h2 className="font-bold text-gray-900 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-500" />
              AKN Tutor
            </h2>
            <p className="text-xs text-gray-500">Powered by Gemma 4 (Edge Node)</p>
          </div>
          <button className="flex items-center space-x-1 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors">
            <Globe className="w-3 h-3" />
            <span>Hausa/English</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-sm" 
                  : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask for an explanation or translation..."
              className="w-full bg-gray-50 border border-gray-300 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="absolute right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
