"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LanguageToggle from "@/components/LanguageToggle";
import UploadDropzone from "@/components/UploadDropzone";
import { BookOpen, GraduationCap, Compass, Cpu } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [langPref, setLangPref] = useState("mixed");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language_pref: langPref }),
      });

      if (!res.ok) {
        throw new Error("Could not initialize session. Make sure the backend server is running.");
      }

      const data = await res.json();
      setSessionId(data.id);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong starting the session.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (docId: string) => {
    // Redirect to the session dashboard
    router.push(`/session/${sessionId}?docId=${docId}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background decoration elements */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden blur-[120px] opacity-25">
        <div className="absolute top-10 left-[20%] w-[300px] h-[300px] rounded-full bg-primary"></div>
        <div className="absolute bottom-10 right-[25%] w-[350px] h-[350px] rounded-full bg-secondary"></div>
      </div>

      <div className="w-full max-w-4xl flex flex-col space-y-12 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center flex flex-col items-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" /> Next-Gen Offline LLM Learning
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-primary bg-clip-text text-transparent max-w-3xl">
            Sunkuyar Karatu Da Gemma Compass
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl font-sans">
            Upload your course outlines, notes, or slides. Gemma extracts key concepts and explains them bilingually in English and Hausa, keeping you fully prepared offline.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl flex flex-col space-y-2 border border-border">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Bilingual Key Concepts</h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Understand hard ideas through side-by-side Hausa and English translations tailored for local curricula.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl flex flex-col space-y-2 border border-border">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary mb-2">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Adaptive RAG Chat</h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Chat with your notes. Compass code-switches naturally between Hausa and English inside responses just like in Nigerian study groups.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl flex flex-col space-y-2 border border-border">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent mb-2">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base">Bespoke Diagnostic Quizzes</h3>
            <p className="text-xs text-gray-400 font-sans leading-relaxed">
              Take generated MCQs to identify knowledge gaps, and get a customized study roadmap for exam revisions.
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="w-full max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-border flex flex-col items-center space-y-6">
          {!sessionId ? (
            <div className="w-full flex flex-col space-y-6">
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold text-white mb-1">Create Study Session</h2>
                <p className="text-xs text-gray-400">Choose your language preference to initialize local LLM weights</p>
              </div>

              <LanguageToggle currentPref={langPref} onChange={setLangPref} />

              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <button
                type="button"
                disabled={loading}
                onClick={startSession}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 scale-100 hover:scale-[1.01]"
              >
                {loading ? "Starting session..." : "Start Bilingual Session"}
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col space-y-6">
              <div className="flex flex-col items-center text-center">
                <span className="text-xs text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full font-medium mb-3">
                  Session Initialized: {sessionId.slice(0, 8)}...
                </span>
                <h2 className="text-xl font-bold text-white mb-1">Process Document</h2>
                <p className="text-xs text-gray-400">Upload slides or outline to extract concepts</p>
              </div>

              <UploadDropzone sessionId={sessionId} onUploadSuccess={handleUploadSuccess} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
