import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gemma Compass — Bilingual Academic Tutor",
  description: "AI-powered bilingual (English & Hausa) offline academic tutor for university students, powered by Gemma.",
  keywords: ["Gemma", "AI Tutor", "Hausa", "Bilingual Education", "Offline AI", "Nigeria", "ABU Zaria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {/* Premium Navigation Header */}
        <header className="sticky top-0 z-50 w-full glass-panel border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-primary bg-clip-text text-transparent">
                Gemma Compass
              </span>
            </Link>
            <nav className="flex items-center space-x-1">
              <span className="text-xs bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full font-mono font-medium">
                Offline Sandbox (Gemma 2B)
              </span>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>

        {/* Footer */}
        <footer className="w-full glass-panel border-t border-border mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 Gemma Compass. Build with Gemma Hackathon — GDG Campus ABU.
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Track: Local Languages & Literacy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              <span>100% Local Inference</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
