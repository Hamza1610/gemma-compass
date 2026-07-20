"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ChatBubble from "@/components/ChatBubble";
import LanguageToggle from "@/components/LanguageToggle";
import { api, Document, Message } from "@/lib/api";
import { 
  FileText, MessageSquare, GraduationCap, 
  Send, Loader2, AlertCircle, RefreshCcw, Sparkles 
} from "lucide-react";

export default function TutorChat() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const docId = searchParams.get("docId");

  const [document, setDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [langPref, setLangPref] = useState("mixed");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessionAndDocument = async () => {
    try {
      const sessionData = await api.getSession(id);
      setLangPref(sessionData.language_pref);

      if (docId) {
        const docData = await api.getDocument(docId);
        setDocument(docData);
      }
    } catch (err) {
      console.error("Failed to load initial layout data:", err);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      await fetchSessionAndDocument();
      const history = await api.getChatHistory(id);
      setMessages(history);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load chat history. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id, docId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleLanguageChange = async (newPref: string) => {
    setLangPref(newPref);
    try {
      await api.updateSession(id, newPref);
    } catch (err) {
      console.error("Failed to update session language preference:", err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || sending) return;

    setInputText("");
    setSending(true);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: Math.random().toString(),
      session_id: id,
      role: "user",
      content: text,
      language: langPref,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const reply = await api.sendMessage(id, text);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error("Failed to send message:", err);
      // Add error system message
      const tempSystemMsg: Message = {
        id: Math.random().toString(),
        session_id: id,
        role: "assistant",
        content: "An error occurred trying to connect to local LLM. Please make sure Ollama and FastAPI are running.",
        language: langPref,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempSystemMsg]);
    } finally {
      setSending(false);
    }
  };

  const suggestions = [
    "Explain the core concept in pure Hausa.",
    "Bani cikakken bayani akan mahimman darussan da ke cikin takardar nan.",
    "Give me 3 review questions on this material.",
    "Create a simple mnemonic to remember these laws.",
  ];

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-gray-400 font-sans">Connecting to bilingual tutor chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Chat Connection Error</h3>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col min-h-0">
      
      {/* Session Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 shrink-0">
        <div>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">Active Study Session</span>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
            <FileText className="w-6 h-6 text-primary" /> {document?.filename || "Lecture Notes"}
          </h2>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center bg-white/5 border border-white/10 p-1 rounded-xl shrink-0">
          <Link
            href={`/session/${id}?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Summary & Concepts
          </Link>
          <Link
            href={`/session/${id}/chat?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-white shadow-md shadow-primary/10"
          >
            <MessageSquare className="w-3.5 h-3.5" /> Chat Tutor
          </Link>
          <Link
            href={`/session/${id}/quiz?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5" /> Diagnostics Quiz
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch mt-6 flex-1 min-h-0">
        
        {/* Settings Column */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-border flex flex-col space-y-4">
            <h3 className="font-bold text-white text-sm">Chat Response settings</h3>
            <LanguageToggle currentPref={langPref} onChange={handleLanguageChange} />
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-border flex flex-col space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" /> Suggestions
            </h4>
            <div className="flex flex-col space-y-2">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(s)}
                  className="text-left p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 hover:border-white/10 text-[10px] text-gray-400 hover:text-gray-200 transition-all leading-relaxed font-sans"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Window Column */}
        <div className="lg:col-span-3 glass-panel rounded-3xl border border-border flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between shrink-0 bg-white/[0.01]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Bilingual Academic Tutor</h4>
                <p className="text-[10px] text-gray-500 font-sans">Powered by Gemma Local Weights</p>
              </div>
            </div>
            <span className="text-[10px] text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full uppercase font-medium">
              RAG Connected
            </span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-2">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Start the Conversation</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans mt-1">
                    Ask questions, request summaries, or have Compass test you on concepts from the uploaded slides.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  language={msg.language}
                  createdAt={msg.created_at}
                />
              ))
            )}

            {sending && (
              <div className="flex w-full justify-start items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="px-4 py-3 rounded-2xl text-xs text-gray-400 bg-white/5 border border-white/5 animate-pulse rounded-tl-none font-sans">
                  Gemma is processing response...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-border bg-white/[0.01] shrink-0 rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:border-primary/45 transition-colors"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Compass a question about your notes..."
                disabled={sending}
                className="flex-1 bg-transparent border-0 ring-0 focus:ring-0 text-sm text-white px-3 py-2 placeholder-gray-500 font-sans outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  inputText.trim() && !sending
                    ? "bg-gradient-to-tr from-primary to-secondary text-white hover:scale-105 cursor-pointer shadow-md shadow-primary/10"
                    : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
