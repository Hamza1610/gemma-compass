# Product Requirements Document (PRD)

## Gemma Compass: The AI Knowledge Navigation Platform
**Version:** 1.0 (Hackathon MVP)  
**Status:** Product Design  
**Hackathon:** Build with Gemma Hackathon 2026  
**Primary Track:** Local Language & Literacy  
**Secondary Track:** Civic & Campus Life  
**Powered By:** Google Gemma 4  
**Flagship MVP:** Compass Campus

---

## 1. One-Sentence Product Statement
An offline-first multilingual study companion for Nigerian university students, powered by Gemma 4, that transforms information into understanding through personalized, adaptive learning journeys.

## 2. Executive Summary
Compass Campus is an offline-first multilingual AI study companion built for university students in low-connectivity environments. Students can upload lecture notes or PDFs, and receive structured explanations, knowledge-gap analysis, personalized study guidance, and adaptive quizzes in English and Hausa.

Powered by the Gemma Compass Engine (an AI Knowledge Navigation framework built on Google Gemma 4), it proactively identifies what learners understand, what they are missing, and what they should learn next. This approach—Adaptive Knowledge Navigation (AKN)—guides users through complex information instead of just waiting for questions. 

**Why Gemma 4?**
Without Gemma 4, Compass Campus would merely be a document reader. Gemma 4 enables:
- Multimodal understanding of educational materials.
- Native multilingual reasoning (English & Hausa).
- Offline, on-device capabilities for low-connectivity environments.
- Function-calling for concept extraction, quiz generation, and personalized roadmaps.

## 3. Vision & Mission
**Vision:** To empower every person to understand complex information regardless of language, educational background, or access to traditional internet resources by building the world's most trusted offline AI Knowledge Navigation Platform.

**Mission:** To bridge the gap between information and understanding by helping learners discover knowledge gaps, navigate personalized learning paths, and build lasting comprehension through their preferred language.

## 4. Problem Statement
University students are overwhelmed with information (lecture notes, textbooks, policies) but lack personalized guidance. Traditional AI assistants only answer direct questions—meaning if a student doesn't know what they don't know, they can't ask the right questions. This is compounded in Nigerian universities where the language of instruction (English) may not be the student's most comfortable learning language (e.g., Hausa). Furthermore, poor internet connectivity restricts access to cloud-based AI tools.

## 5. The Solution: Gemma Compass & AKN
Gemma Compass introduces **Adaptive Knowledge Navigation (AKN)**. Rather than simply retrieving answers, the system performs intelligent functions:
- **Explain:** Simplifies complex information.
- **Connect:** Links new ideas with prior knowledge.
- **Diagnose:** Identifies missing foundational knowledge.
- **Navigate:** Creates personalized learning journeys.
- **Evaluate:** Measures understanding via adaptive quizzes.
- **Adapt:** Code-switches naturally between English and Hausa.

## 6. Hackathon MVP Scope: Compass Campus
*To maximize success for the 1-day sprint, the MVP is strictly scoped to a single, exceptional end-to-end workflow.*

### The Golden Path (End-to-End Workflow)
1. **Upload:** Student uploads a lecture note (PDF/Text).
2. **Extract & Explain:** Gemma parses the document, extracting core concepts and explaining them side-by-side in English and Hausa.
3. **Diagnose:** Gemma detects potential prerequisites or missing knowledge.
4. **Chat Tutor:** Student interacts with the material via a natural code-switching chat.
5. **Evaluate:** Gemma generates a diagnostic quiz on the material.
6. **Navigate:** Based on quiz results, Gemma builds a customized "Study Revision Roadmap" showing the next recommended topic.

## 7. Target Users
- **Primary:** Nigerian University and Polytechnic students (especially those in low-connectivity areas or who benefit from Hausa language support).

## 8. Technical Stack
- **AI Model:** Google Gemma 4 (quantized local weights via Ollama, e.g., `gemma4:e2b`).
- **Embeddings:** `nomic-embed-text` (local).
- **Frontend:** Next.js 14 (App Router), Tailwind CSS.
- **Backend:** Python (FastAPI), SQLModel.
- **Database/Vector Store:** SQLite with `sqlite-vec` extension for purely local vector search.

## 9. Success Metrics
For the hackathon, success is defined by a flawless live demo demonstrating:
- Accurate extraction and explanation of course concepts in English and Hausa.
- Seamless code-switching in chat without internet connectivity.
- Successful generation of a customized study roadmap based on quiz performance.
