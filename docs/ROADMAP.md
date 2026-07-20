# Development Roadmap
**Project:** Gemma Compass  
**Target:** Build with Gemma Hackathon MVP  

## 1. Development Philosophy
Focus on the single vertical: **Compass Campus**. Every task must contribute directly to demonstrating **Adaptive Knowledge Navigation (AKN)**. If a feature does not strengthen the MVP story, it is postponed.

## 2. MVP Scope (MoSCoW Prioritization)
**Must Have (Critical):**
- Authentication
- Upload PDF/Image & OCR/Text Extraction
- Gemma Document Understanding & Concept Extraction
- Knowledge Map & Gap Detection
- Adaptive Explanation & Learning Path
- Quiz Generation & Progress Dashboard
- Multilingual Support (English + Hausa)

**Should Have / Could Have (Postponed if needed):** Voice Input/Output, Dark Mode, Offline Cache, Document History, Bookmarks, Streaks.

## 3. Project Structure (Monorepo)
```text
gemma-compass/
├── apps/
│   ├── mobile/ (Flutter)
│   ├── web/ (Next.js)
├── backend/ (FastAPI)
├── ai/ (Gemma services)
├── docs/
└── README.md
```

## 4. Sprint Plan
- **Sprint 1 — Foundation:** Monorepo setup, FastAPI, Flutter/Web, Postgres, Auth, Landing Dashboard.
- **Sprint 2 — Document Intelligence:** Upload docs, OCR, Gemma analysis, concept extraction.
- **Sprint 3 — Knowledge Navigation:** Knowledge graph, gap detection, learning path generation.
- **Sprint 4 — Understanding & Assessment:** Adaptive explanations, quiz generation/evaluation, progress updates.
- **Sprint 5 — Polish & Demo:** UI polish, demo dataset, presentation flow, pitch deck.

## 5. Demo Timeline (5 Minutes)
- **0:00–0:30:** Introduce problem.
- **0:30–1:15:** Upload lecture note.
- **1:15–2:00:** Show concept extraction and Knowledge Map.
- **2:00–3:00:** Demonstrate gap detection and adaptive explanation (English + Hausa).
- **3:00–4:00:** Generate learning path and quiz.
- **4:00–5:00:** Show progress dashboard and broader platform vision.

## 6. Success Criteria
A coherent user journey from upload to progress tracking, powered by local Gemma 4, effectively identifying learning gaps and offering multilingual explanations.
