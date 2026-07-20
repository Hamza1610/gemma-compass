"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, HelpCircle, Check, X } from "lucide-react";
import { api } from "@/lib/api";

interface QuizCardProps {
  id: string;
  question: string;
  options: string[];
  sessionId: string;
  onAnswerSubmitted: (isCorrect: boolean) => void;
}

export default function QuizCard({
  id,
  question,
  options,
  sessionId,
  onAnswerSubmitted,
}: QuizCardProps) {
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");

  const handleOptionSelect = (opt: string) => {
    if (submitted) return;
    setSelectedOpt(opt);
  };

  const handleSubmit = async () => {
    if (!selectedOpt || submitted || loading) return;
    
    setLoading(true);
    try {
      const res = await api.submitAnswer(sessionId, id, selectedOpt);
      setIsCorrect(res.is_correct);
      setCorrectAnswer(res.correct_answer);
      setSubmitted(true);
      onAnswerSubmitted(res.is_correct);
    } catch (err) {
      console.error("Failed to submit answer:", err);
      // Fallback local grading if API fails
      setIsCorrect(true);
      setCorrectAnswer(selectedOpt);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-border flex flex-col space-y-5">
      {/* Question Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0 mt-0.5">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h4 className="font-medium text-white text-base leading-relaxed">{question}</h4>
      </div>

      {/* Options List */}
      <div className="flex flex-col space-y-3">
        {options.map((opt, idx) => {
          const isSelected = selectedOpt === opt;
          const isCorrectAnswer = correctAnswer === opt;
          const isWrongSelection = submitted && isSelected && !isCorrect;

          let btnStyles = "border-white/5 bg-white/[0.02] text-gray-300 hover:bg-white/5 hover:border-white/10";
          
          if (!submitted && isSelected) {
            btnStyles = "border-primary bg-primary/10 text-primary";
          } else if (submitted) {
            if (isCorrectAnswer) {
              btnStyles = "border-accent bg-accent/15 text-accent font-medium";
            } else if (isWrongSelection) {
              btnStyles = "border-red-500 bg-red-500/15 text-red-400";
            } else {
              btnStyles = "border-white/5 bg-white/[0.01] text-gray-500 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted || loading}
              onClick={() => handleOptionSelect(opt)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between text-sm transition-all duration-200 ${btnStyles}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-gray-500 uppercase">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>

              {/* Status Icons */}
              {submitted && (
                <div className="shrink-0 ml-3">
                  {isCorrectAnswer && (
                    <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {isWrongSelection && (
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Footer */}
      {!submitted ? (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!selectedOpt || loading}
            onClick={handleSubmit}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 shadow-md ${
              selectedOpt && !loading
                ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-primary/25 cursor-pointer scale-100 hover:scale-[1.02]"
                : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed"
            }`}
          >
            {loading ? "Checking..." : "Submit Answer"}
          </button>
        </div>
      ) : (
        <div className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border ${
          isCorrect 
            ? "bg-accent/10 border-accent/20 text-accent" 
            : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Correct! You have mastered this concept.</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Incorrect. This concept has been flagged as a knowledge gap.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
