"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api, Document, Concept, RoadmapItem, Message } from "@/lib/api";
import KnowledgeMap from "@/components/KnowledgeMap";
import { 
  FileText, GraduationCap, 
  Loader2, AlertCircle, RefreshCcw, BookOpen, ArrowRight, Lightbulb, MessageSquare, Send, Mic
} from "lucide-react";
import ChatBubble from "@/components/ChatBubble";

export default function GuidedStudySession() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const docId = searchParams.get("docId");

  const [document, setDocument] = useState<Document | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Follow-up chat state
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support the Web Speech API. Try Chrome or Edge.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // We set lang to English by default. OS engines will try their best with Hausa.
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText((prev) => prev ? prev + " " + transcript : transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const fetchSessionData = async () => {
    setLoading(true);
    setError("");
    try {
      if (docId) {
        const docData = await api.getDocument(docId);
        setDocument(docData);
        
        const docConcepts = await api.getDocumentConcepts(docId);
        setConcepts(docConcepts);
      }
      const roadmapData = await api.getRoadmap(id);
      setRoadmap(roadmapData);
      
      const history = await api.getChatHistory(id);
      setMessages(history);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load study session.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, [id, docId]);

  useEffect(() => {
    if (showChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending, showChat]);

  const handleNextConcept = () => {
    if (activeIndex < concepts.length - 1) {
      setActiveIndex(prev => prev + 1);
      setShowChat(false);
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || sending) return;

    setInputText("");
    setSending(true);
    setShowChat(true);

    const tempUserMsg: Message = {
      id: Math.random().toString(),
      session_id: id,
      role: "user",
      content: text,
      language: "mixed",
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const reply = await api.sendMessage(id, text);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-sans">Loading your guided study journey...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Error</h3>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button
          onClick={fetchSessionData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Retry Connection
        </button>
      </div>
    );
  }

  const currentConcept = concepts[activeIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">
      
      {/* Session Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6 shrink-0">
        <div>
          <span className="text-xs font-mono text-blue-600 uppercase tracking-wider font-bold">Active Study Session</span>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mt-1">
            <FileText className="w-6 h-6 text-blue-500" /> {document?.filename || "Lecture Notes"}
          </h2>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl shrink-0">
          <Link
            href={`/session/${id}?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Summary
          </Link>
          <Link
            href={`/session/${id}/study?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-white text-blue-600 shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" /> Guided Study
          </Link>
          <Link
            href={`/session/${id}/quiz?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" /> Diagnostics Quiz
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-6 flex-1 min-h-0">
        
        {/* Knowledge Map Column */}
        <div className="lg:col-span-1 hidden lg:block bg-white rounded-3xl border border-gray-200 p-4 sticky top-6 shadow-sm">
          <h3 className="font-bold text-gray-900 text-sm mb-4 px-4 flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-blue-500" /> Roadmap
          </h3>
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <KnowledgeMap 
              concepts={concepts} 
              roadmap={roadmap} 
              activeIndex={activeIndex}
              onConceptSelect={(c, i) => {
                setActiveIndex(i);
                setShowChat(false);
              }}
            />
          </div>
        </div>

        {/* Study Flow Column */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {currentConcept ? (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              
              {/* Concept Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Concept {activeIndex + 1} of {concepts.length}</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{currentConcept.name}</h2>
                </div>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
              </div>

              {/* Bilingual Side-by-Side Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                {/* English Column */}
                <div className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="w-6 h-4 bg-gray-200 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">EN</span>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">English</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-serif text-lg">
                    {currentConcept.explanation_en || "No English explanation available."}
                  </p>
                </div>
                
                {/* Hausa Column */}
                <div className="p-6 md:p-8 hover:bg-gray-50/50 transition-colors bg-blue-50/10">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="w-6 h-4 bg-green-100 rounded flex items-center justify-center text-[10px] font-bold text-green-700">HA</span>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Hausa</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-serif text-lg">
                    {currentConcept.explanation_ha || "Babu bayani da Hausa a yanzu."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-4">
                <button 
                  onClick={handleNextConcept}
                  disabled={activeIndex === concepts.length - 1}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{activeIndex === concepts.length - 1 ? "Module Completed" : "I Understand (Next)"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleSendMessage(`Explain ${currentConcept.name} simpler with a local example.`)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
                >
                  Give me an example
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
              <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">No Concepts Found</h3>
              <p className="text-gray-500 mt-2">Gemma couldn't extract any concepts from this document.</p>
            </div>
          )}

          {/* Fallback Chat UI (Only visible when user asks a follow-up) */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col mt-6">
            
            <button 
              onClick={() => setShowChat(!showChat)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-900">Have more questions? Chat with Gemma</span>
              </div>
              <div className={`transform transition-transform ${showChat ? 'rotate-180' : ''}`}>
                ▼
              </div>
            </button>

            {showChat && (
              <div className="flex flex-col h-[400px] border-t border-gray-100">
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
                  {messages.map((msg) => (
                    <ChatBubble
                      key={msg.id}
                      role={msg.role}
                      content={msg.content}
                      language={msg.language}
                      createdAt={msg.created_at}
                    />
                  ))}
                  {sending && (
                    <div className="flex w-full justify-start items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl text-xs text-gray-500 bg-white border border-gray-100 animate-pulse rounded-tl-none">
                        Gemma is typing...
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl p-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
                  >
                    <button
                      type="button"
                      onClick={startListening}
                      disabled={sending || isListening}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isListening 
                          ? "bg-red-100 text-red-600 animate-pulse border border-red-200" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent"
                      }`}
                      title={isListening ? "Listening..." : "Speak your question"}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isListening ? "Listening to your voice..." : "Ask for more clarity in Hausa or English..."}
                      disabled={sending || isListening}
                      className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 text-sm text-gray-900 px-3 py-2 placeholder-gray-400 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || sending}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        inputText.trim() && !sending
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
