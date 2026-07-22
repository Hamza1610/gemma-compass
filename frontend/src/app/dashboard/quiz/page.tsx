"use client";

import React, { useState } from "react";
import { BookOpen, CheckCircle2, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    {
      question: "Which of the following best describes 'Paging' in Operating Systems?",
      options: [
        "A technique to store data on a hard drive permanently.",
        "Dividing logical memory into blocks of the same size called pages.",
        "A process scheduling algorithm based on time quantums.",
        "A method to prevent deadlocks in multi-threading."
      ],
      correctAnswer: 1,
      explanation: "Paging allows the physical address space of a process to be noncontiguous. It divides logical memory into blocks of the same size called pages."
    },
    {
      question: "What is the main advantage of using a Page Table?",
      options: [
        "It speeds up CPU clock speed.",
        "It maps logical addresses to physical addresses.",
        "It compresses data before sending to RAM.",
        "It prevents unauthorized access to the internet."
      ],
      correctAnswer: 1,
      explanation: "The Page Table acts as a map. The CPU uses it to translate logical addresses (pages) into physical addresses (frames) in RAM."
    }
  ];

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setQuizComplete(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-purple-600" />
          Diagnostic Quiz
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Module 2: Memory Management & Paging
        </p>
      </div>

      {!quizComplete ? (
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          
          {/* Progress Bar */}
          <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="flex space-x-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i <= currentQuestion ? "bg-purple-600" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-8">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = isSubmitted && index === questions[currentQuestion].correctAnswer;
                const isWrongSelected = isSubmitted && isSelected && !isCorrect;

                let borderClass = "border-gray-200 hover:border-purple-300";
                let bgClass = "bg-white hover:bg-purple-50";

                if (isSelected && !isSubmitted) {
                  borderClass = "border-purple-600";
                  bgClass = "bg-purple-50";
                } else if (isCorrect) {
                  borderClass = "border-green-500";
                  bgClass = "bg-green-50";
                } else if (isWrongSelected) {
                  borderClass = "border-red-500";
                  bgClass = "bg-red-50";
                }

                return (
                  <button
                    key={index}
                    disabled={isSubmitted}
                    onClick={() => setSelectedAnswer(index)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderClass} ${bgClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isCorrect ? "text-green-800" : isWrongSelected ? "text-red-800" : "text-gray-800"}`}>
                        {option}
                      </span>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {isWrongSelected && <AlertCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <div className={`mt-8 p-4 rounded-xl ${selectedAnswer === questions[currentQuestion].correctAnswer ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                <h4 className="font-bold mb-1">
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? "Correct!" : "Not quite right."}
                </h4>
                <p className="text-sm">
                  {questions[currentQuestion].explanation}
                </p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-sm flex items-center"
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl font-extrabold text-purple-600">{score}/{questions.length}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 max-w-md mb-8">
            Gemma has updated your Adaptive Knowledge Roadmap based on these results.
          </p>
          <div className="flex space-x-4">
            <button onClick={() => window.location.reload()} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold px-4 py-2">
              <RefreshCw className="w-5 h-5 mr-2" />
              Retake
            </button>
            <Link 
              href="/dashboard/study"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-purple-600/20"
            >
              Return to Roadmap
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
