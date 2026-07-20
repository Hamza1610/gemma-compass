"use client";

import React from "react";
import Link from "next/link";
import { Compass, BookOpen, BrainCircuit, Globe, ServerOff, ArrowRight, Upload, Languages, Target, Map, Route, Bot, Users, Lightbulb, FileText, Zap, Brain, Apple, Play } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 flex flex-col overflow-x-hidden">
      
      {/* 1. Navbar Section */}
      <header className="w-full fixed top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img 
              src="/images/logo.png" 
              alt="Gemma Compass" 
              className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#technology" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Technology</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              Log In
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-gray-900/10 transition-all hover:shadow-gray-900/20 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="mt-20 relative">
        {/* Background Decorative Mesh/Gradients */}
        <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-br from-blue-100/50 via-purple-50/50 to-white rounded-full blur-[100px] opacity-70"></div>
          <div className="absolute top-40 -left-40 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[80px]"></div>
          <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-pink-50/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wide mb-8">
              <Globe className="w-3.5 h-3.5" /> 
              <span>Built for Northern Nigeria</span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Transform Information <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">into Understanding.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl lg:max-w-md xl:max-w-xl mb-10 leading-relaxed">
              An offline-first, bilingual study companion that doesn't just answer questions—it guides you through personalized learning journeys using Adaptive Knowledge Navigation.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 w-full">
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-8 py-4 rounded-full shadow-xl shadow-blue-600/20 transition-all hover:shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <span>Launch Compass Campus</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <a 
                href="#technology"
                className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-base font-semibold px-8 py-4 rounded-full transition-all flex items-center justify-center space-x-2"
              >
                <ServerOff className="w-5 h-5 text-gray-400" />
                <span>Explore Offline Tech</span>
              </a>
            </div>
            
            <p className="mt-6 text-sm text-gray-400 font-medium">
              Powered locally by Google Gemma 4
            </p>
          </div>

          {/* Right Phone Mockup (Live PWA Preview) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            {/* Soft glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 blur-3xl opacity-20 transform scale-90"></div>
            
            <div className="relative w-[320px] md:w-[360px] h-[720px] bg-black rounded-[48px] shadow-2xl border-[12px] border-gray-900 overflow-hidden flex-shrink-0 transform lg:-rotate-2 transition-transform hover:rotate-0 duration-500">
               {/* Dynamic Island / Notch */}
               <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-32 mx-auto z-20 shadow-sm"></div>
               {/* Dashboard iframe */}
               <iframe 
                  src="/dashboard" 
                  className="w-full h-full bg-[#F8F9FA] border-none" 
                  title="Compass Campus Dashboard Preview"
                />
            </div>
          </div>
        </div>
      </main>

      {/* 3. Problem & Features Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2 block">Our Features</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Stop searching for answers. <br className="hidden md:block" /> Start building understanding.
            </h2>
            <p className="text-lg text-gray-500">
              Traditional AI waits for you to ask the right questions. Gemma Compass uses <strong>Adaptive Knowledge Navigation (AKN)</strong> to proactively discover your knowledge gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<FileText className="w-6 h-6" />}
              title="Multimodal Extraction"
              description="Upload your lecture notes, PDFs, or snap a picture of the whiteboard to instantly extract core concepts."
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6" />}
              title="Bilingual Explanations"
              description="Get complex topics seamlessly explained with natural code-switching between Hausa and English."
            />
            <FeatureCard 
              icon={<Lightbulb className="w-6 h-6" />}
              title="Gap Detection Quizzes"
              description="Take adaptive diagnostic quizzes that uncover missing prerequisites you didn't even know you lacked."
            />
            <FeatureCard 
              icon={<Route className="w-6 h-6" />}
              title="Personalized Roadmaps"
              description="Follow a step-by-step study plan tailored exclusively to your quiz performance and learning speed."
            />
            <FeatureCard 
              icon={<Bot className="w-6 h-6" />}
              title="100% Offline AI"
              description="Powered entirely by local Gemma 4 inference. No internet required. Complete data privacy."
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6" />}
              title="Gamified Study Goals"
              description="Track your daily study streaks, complete academic challenges, and master courses efficiently."
            />
          </div>
        </div>
      </section>

      {/* 3.5 Why Choose Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Why Choose Gemma Compass?
            </h2>
            <p className="text-lg text-gray-500">
              Experience the future of online learning with our AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-blue-50/50 flex flex-col space-y-4">
              <Zap className="w-8 h-8 text-blue-600 mb-2" strokeWidth={1.5} />
              <h3 className="font-bold text-gray-900 text-lg">AI-Powered Personalization</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Get personalized learning paths and recommendations tailored to your goals and learning style.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-blue-50/50 flex flex-col space-y-4">
              <Target className="w-8 h-8 text-blue-600 mb-2" strokeWidth={1.5} />
              <h3 className="font-bold text-gray-900 text-lg">Faster Learning</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Our courses are designed to help you learn faster and more effectively.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-blue-50/50 flex flex-col space-y-4">
              <Brain className="w-8 h-8 text-blue-600 mb-2" strokeWidth={1.5} />
              <h3 className="font-bold text-gray-900 text-lg">Interactive Learning</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Engage with quizzes, assignments, AI chat, and a vibrant community of learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technology Section */}
      <section id="technology" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="w-full lg:w-1/2 flex flex-col space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full w-max">
              <ServerOff className="w-3.5 h-3.5" /> 
              <span>100% Offline Capable</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Learning never stops, <br /> even when the internet does.
            </h2>
            
            <p className="text-gray-400 text-lg leading-relaxed">
              Powered entirely by on-device local inference using Google Gemma 4 models. There is no cloud, no latency, and absolutely no data privacy concerns. Once you download the app, you carry a world-class bilingual tutor in your pocket forever.
            </p>
          </div>

          <div className="w-full lg:w-1/2 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-sm">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Google Gemma 4 (2B)</h4>
                  <p className="text-sm text-gray-400">Lightning fast on-device inference.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white">Local RAG Pipeline</h4>
                  <p className="text-sm text-gray-400">sqlite-vec for instant semantic search across your notes.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>



      {/* 4.5 Mobile Experience Section */}
      <section className="bg-blue-600 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text */}
          <div className="w-full lg:w-1/2 flex flex-col text-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Experience Gemma Compass <br className="hidden md:block" /> on mobile!
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed max-w-xl">
              Access your AI-powered study ecosystem anywhere. Generate custom learning roadmaps, learn with your interactive AI tutor, track your study consistency, and connect with other students.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="flex items-center justify-center space-x-3 bg-gray-900 hover:bg-black text-white rounded-xl px-6 py-3 transition-colors w-full sm:w-auto border border-gray-800 shadow-lg">
                <Apple className="w-8 h-8 fill-current" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-gray-300">Download on the</div>
                  <div className="text-lg font-semibold leading-tight">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center space-x-3 bg-gray-900 hover:bg-black text-white rounded-xl px-6 py-3 transition-colors w-full sm:w-auto border border-gray-800 shadow-lg">
                <Play className="w-7 h-7 fill-current text-gray-200" />
                <div className="text-left">
                  <div className="text-[10px] leading-none text-gray-300">GET IT ON</div>
                  <div className="text-lg font-semibold leading-tight">Google Play</div>
                </div>
              </button>
            </div>
            
            <p className="text-sm text-blue-200 mt-6 pt-4 border-t border-blue-500/50 w-max">
              5.00 Rating • Over 100 Downloads
            </p>
          </div>

          {/* Right Phone Mockup */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-16 lg:mt-0 perspective-1000">
            {/* Dark background shadow card */}
            <div className="absolute top-1/2 right-4 lg:-right-8 transform -translate-y-1/2 w-[320px] h-[680px] bg-blue-900 rounded-[48px] rotate-[-15deg] shadow-2xl"></div>
            
            {/* Phone Frame */}
            <div className="relative w-[320px] md:w-[340px] h-[680px] bg-black rounded-[48px] shadow-2xl border-[12px] border-gray-900 overflow-hidden flex-shrink-0 transform rotate-[10deg] transition-transform hover:rotate-0 duration-500 z-10">
               <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-32 mx-auto z-20 shadow-sm"></div>
               <iframe 
                  src="/dashboard" 
                  className="w-full h-full bg-[#F8F9FA] border-none" 
                  title="Mobile App Preview"
                  tabIndex={-1}
                  style={{ pointerEvents: 'auto' }}
                />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Final CTA / Footer */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ready to master your courses?
          </h2>
          <p className="text-gray-500 text-lg">
            Join thousands of students turning their confusing lecture slides into clear, native-language understanding.
          </p>
          <Link 
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-10 py-4 rounded-full shadow-xl shadow-blue-600/20 transition-all hover:shadow-blue-600/30"
          >
            Create Your Free Account
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Gemma Compass" className="h-6 w-auto" />
            <span className="font-bold text-gray-900">Gemma Compass</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 Gemma Compass. Build with Gemma Hackathon — Track 1 (Local Languages & Literacy).
          </p>
        </div>
      </footer>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col space-y-4 group hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 text-xl group-hover:text-white transition-colors duration-300">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-1 group-hover:text-blue-50 transition-colors duration-300">{description}</p>
      
      <div className="flex items-center space-x-2 text-blue-600 text-sm font-semibold group-hover:text-white transition-colors duration-300 mt-4">
        <span>Learn More</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}


