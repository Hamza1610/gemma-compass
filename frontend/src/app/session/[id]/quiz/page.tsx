"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import QuizCard from "@/components/QuizCard";
import LanguageToggle from "@/components/LanguageToggle";
import { api, Document, QuizQuestion } from "@/lib/api";
import { 
  FileText, MessageSquare, GraduationCap, 
  Loader2, AlertCircle, RefreshCcw, ClipboardList, CheckCircle, Map, BookOpen 
} from "lucide-react";

export default function ConceptQuiz() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const docId = searchParams.get("docId");

  const [document, setDocument] = useState<Document | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [langPref, setLangPref] = useState("mixed");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const fetchSessionAndDocument = async () => {
    try {
      const sessionData = await api.getSession(id);
      setLangPref(sessionData.language_pref);

      if (docId) {
        const docData = await api.getDocument(docId);
        setDocument(docData);
        
        // Attempt to load questions if they were already generated
        const res = await fetch(`http://localhost:8000/api/quiz/${docId}/generate`, {
          method: "POST"
        });
        if (res.ok) {
          const quizList = await res.json();
          // Filter out questions without id or properties if empty fallback
          if (quizList && quizList.length > 0) {
            setQuestions(quizList);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load initial quiz layout details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAndDocument();
  }, [id, docId]);

  const handleLanguageChange = async (newPref: string) => {
    setLangPref(newPref);
    try {
      await api.updateSession(id, newPref);
    } catch (err) {
      console.error("Failed to update session language preference:", err);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!docId) return;
    setGenerating(true);
    setError("");
    try {
      const quizList = await api.generateQuiz(docId);
      setQuestions(quizList);
      setScore(0);
      setAnsweredCount(0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate quiz questions via Gemma.");
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswerResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnsweredCount((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-gray-400 font-sans">Connecting to diagnostics system...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8 max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-bold text-white mb-2">Quiz Connection Error</h3>
        <p className="text-sm text-gray-400 mb-6">{error}</p>
        <button
          onClick={fetchSessionAndDocument}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition-colors"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Reconnect
        </button>
      </div>
    );
  }

  const isQuizComplete = questions.length > 0 && answeredCount === questions.length;

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
            href={`/session/${id}/study?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> Guided Study
          </Link>
          <Link
            href={`/session/${id}/quiz?docId=${docId}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-primary text-white shadow-md shadow-primary/10"
          >
            <GraduationCap className="w-3.5 h-3.5" /> Diagnostics Quiz
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-6 flex-1">
        
        {/* Left Column: Settings */}
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-border flex flex-col space-y-4">
            <h3 className="font-bold text-white text-sm">Quiz language</h3>
            <LanguageToggle currentPref={langPref} onChange={handleLanguageChange} />
          </div>
        </div>

        {/* Right Column: Quiz Window */}
        <div className="lg:col-span-3 flex flex-col space-y-6">
          
          {/* 1. Generate/Intro State */}
          {questions.length === 0 && !generating && (
            <div className="glass-panel p-8 rounded-3xl border border-border flex flex-col items-center text-center space-y-6 max-w-xl mx-auto mt-8">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">Generate Diagnostics MCQ Quiz</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2 max-w-sm">
                  Gemma will analyze the key concepts extracted from your notes and draft 5 multiple choice questions. Answering these helps diagnose your actual knowledge level.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateQuiz}
                className="px-6 py-3 bg-gradient-to-tr from-primary to-secondary text-white font-semibold text-xs rounded-xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Generate Quiz Questions
              </button>
            </div>
          )}

          {/* 2. Generating State */}
          {generating && (
            <div className="glass-panel p-8 rounded-3xl border border-border flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <Loader2 className="w-10 h-10 text-secondary animate-spin" />
              <h4 className="font-semibold text-white text-base">Creating custom MCQs via Gemma...</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-sans">
                This takes a moment as the local model drafts plausible distractors and aligns questions with concepts.
              </p>
            </div>
          )}

          {/* 3. Quiz Started State */}
          {questions.length > 0 && (
            <div className="flex flex-col space-y-6">
              
              {/* Progress Tracker Card */}
              <div className="glass-panel p-4 rounded-xl border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  <span className="text-xs text-white font-medium">
                    Questions Answered: {answeredCount} / {questions.length}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-sans">
                  Current Score: <span className="font-semibold text-white">{score}</span> correct
                </div>
              </div>

              {/* Quiz list */}
              <div className="flex flex-col space-y-6">
                {questions.map((q) => (
                  <QuizCard
                    key={q.id}
                    id={q.id}
                    question={q.question}
                    options={q.options}
                    sessionId={id}
                    onAnswerSubmitted={handleAnswerResult}
                  />
                ))}
              </div>

              {/* 4. Complete / Summary Card */}
              {isQuizComplete && (
                <div className="glass-panel p-6 rounded-3xl border border-accent/20 bg-accent/[0.01] flex flex-col items-center text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Diagnostics Evaluation Complete!</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans mt-1">
                      You scored <span className="font-bold text-white">{score} out of {questions.length}</span> correct.
                    </p>
                  </div>
                  
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/10 my-2">
                    <div 
                      className="bg-accent h-full transition-all duration-500" 
                      style={{ width: `${(score / questions.length) * 100}%` }}
                    />
                  </div>

                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans max-w-xs">
                    We have updated your revision roadmap. Focus on the concepts where you missed answers.
                  </p>

                  <Link
                    href={`/session/${id}?docId=${docId}`}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white text-xs font-semibold hover:scale-[1.02] transition-all shadow-md shadow-primary/10"
                  >
                    <Map className="w-4 h-4" /> View Revision Roadmap
                  </Link>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
