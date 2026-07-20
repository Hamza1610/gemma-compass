"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import ExplanationCard from "@/components/ExplanationCard";
import LanguageToggle from "@/components/LanguageToggle";
import { api, Document, Concept, RoadmapItem } from "@/lib/api";
import { 
  FileText, MessageSquare, GraduationCap, Map,
  Loader2, AlertCircle, RefreshCcw, ChevronRight, CheckCircle 
} from "lucide-react";

export default function SessionDashboard() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const docId = searchParams.get("docId");

  const [document, setDocument] = useState<Document | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [langPref, setLangPref] = useState("mixed");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!docId) {
      setError("No document specified. Please go back and upload a document.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      // 1. Fetch Session Preference
      const sessionData = await api.getSession(id);
      setLangPref(sessionData.language_pref);

      // 2. Fetch Document
      const docData = await api.getDocument(docId);
      setDocument(docData);

      // 3. Fetch Concepts
      const conceptsData = await api.getDocumentConcepts(docId);
      setConcepts(conceptsData);

      // 4. Fetch Roadmap Gaps
      const roadmapData = await api.getRoadmap(id);
      setRoadmap(roadmapData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load dashboard data. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, docId]);

  const handleLanguageChange = async (newPref: string) => {
    setLangPref(newPref);
    try {
      await api.updateSession(id, newPref);
    } catch (err) {
      console.error("Failed to update session language preference:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-gray-400 font-sans">Loading study dashboard details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Error Loading Session</h3>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-8">
      
      {/* Session Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-white shadow-md shadow-primary/10"
          >
            <FileText className="w-3.5 h-3.5" /> Summary & Concepts
          </Link>
          <Link
            href={`/session/${id}/chat?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Summary and Concept list */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          
          {/* Document Summary Card */}
          <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Document Summary / Taƙaitaccen Bayani
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
                <span className="text-[10px] font-bold text-primary uppercase font-mono">English Summary</span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">{document?.summary_en}</p>
              </div>
              <div className="p-4 rounded-xl border border-primary/5 bg-primary/[0.005] space-y-1">
                <span className="text-[10px] font-bold text-secondary uppercase font-mono">Taƙaitawa a Harshen Hausa</span>
                <p className="text-xs text-gray-200 leading-relaxed italic font-sans">{document?.summary_ha}</p>
              </div>
            </div>
          </div>

          {/* Concepts Section */}
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="font-bold text-white text-lg">Key Academic Concepts</h3>
              <p className="text-xs text-gray-400 font-sans mt-0.5">Click EN/HA toggles on each card to view translation focus.</p>
            </div>
            <div className="flex flex-col space-y-4">
              {concepts.map((concept, index) => (
                <ExplanationCard
                  key={index}
                  name={concept.name}
                  explanationEn={concept.explanation_en}
                  explanationHa={concept.explanation_ha}
                  orderIndex={index}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Settings & Study Roadmap */}
        <div className="flex flex-col space-y-8 lg:sticky lg:top-24">
          
          {/* Settings Card */}
          <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col space-y-4">
            <h3 className="font-bold text-white text-sm">Session Settings</h3>
            <LanguageToggle currentPref={langPref} onChange={handleLanguageChange} />
          </div>

          {/* Revision Roadmap Gap List */}
          <div className="glass-panel p-6 rounded-2xl border border-border flex flex-col space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Map className="w-4 h-4 text-secondary" /> Study Revision Roadmap
            </h3>
            
            {roadmap.length === 0 ? (
              <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 flex flex-col items-center text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-accent" />
                <h4 className="font-semibold text-white text-xs">No Knowledge Gaps Detected!</h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                  Take the diagnostics quiz to verify your knowledge and identify areas that need review.
                </p>
                <Link
                  href={`/session/${id}/quiz?docId=${docId}`}
                  className="px-4 py-1.5 rounded-lg bg-accent/20 border border-accent/30 text-accent text-[10px] font-semibold hover:bg-accent/30 transition-colors"
                >
                  Start Quiz
                </Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                  The following concepts have been flagged from incorrect quiz attempts. Focus on revising these:
                </p>
                <div className="flex flex-col space-y-2">
                  {roadmap.map((item, idx) => (
                    <div 
                      key={item.concept_id}
                      className="p-3.5 rounded-xl border border-red-500/10 bg-red-500/[0.02] flex flex-col space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {item.concept_name}
                        </span>
                        <span className="text-[9px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase">
                          Revision Required
                        </span>
                      </div>
                      
                      {/* Short summary gap explanation */}
                      <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                        {langPref === "ha" ? item.explanation_ha : item.explanation_en}
                      </p>
                      
                      <Link
                        href={`/session/${id}/chat?docId=${docId}`}
                        className="text-[9px] font-semibold text-primary hover:text-white transition-colors flex items-center gap-1 mt-1 justify-end"
                      >
                        Ask Chat Tutor <ChevronRight className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
