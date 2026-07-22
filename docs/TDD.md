# Technical Design Document (TDD)
**Project:** Gemma Compass  
**Version:** 1.0  
**Status:** Architecture Design  
**Author:** Team Gemma Compass

## 1. System Philosophy
Gemma Compass is not an AI chatbot. It is a Knowledge Navigation Platform. The platform helps users move from **Information → Understanding → Mastery** rather than Question → Answer. Every interaction inside the platform follows a reasoning process called **Adaptive Knowledge Navigation (AKN)**.

## 2. Adaptive Knowledge Navigation (AKN)
This is our framework. Every document, conversation, lesson, and interaction follows six stages:
**Discover → Understand → Diagnose → Navigate → Evaluate → Adapt**

### Stage 1 — Discover
The system first discovers user's goal, uploaded document, language, education level, and current topic.

### Stage 2 — Understand
Gemma analyzes PDFs, Images, Lecture Notes, Policies, and Timetables. Then extracts concepts, definitions, entities, and relationships to output a **Concept Graph**.

### Stage 3 — Diagnose
Compass asks "What does the learner already know?" The system identifies misconceptions, missing prerequisites, weak confidence, and repeated mistakes. 

### Stage 4 — Navigate
Compass creates a **Personalized Learning Roadmap** with recommended topics and a learning order.

### Stage 5 — Evaluate
Gemma generates quizzes, reflection questions, examples, and scenarios to measure understanding.

### Stage 6 — Adapt
Compass updates the knowledge graph, difficulty, explanation style, language, and roadmap based on the evaluation.

⭐ **This Is Our Competitive Advantage:** Most AI stops at Question → Answer. Compass continues through Evaluation, Adaptation, Navigation, and Growth.

## 3. High-Level Architecture
```
                   Gemma Compass
           AI Knowledge Navigation Platform
                          │
        ┌────────────────────────────────────┐
        │            Frontend                │
        │ Flutter / Web (Next.js)            │
        └────────────────────────────────────┘
                          │
                          ▼
        ┌────────────────────────────────────┐
        │          FastAPI Backend           │
        └────────────────────────────────────┘
                          │
        ┌────────────────────────────────────┐
        │      Knowledge Navigation Core     │
        └────────────────────────────────────┘
                          │
 ┌──────────────┬──────────────┬──────────────┐
 │              │              │              │
 ▼              ▼              ▼              ▼
Knowledge    Gap Detector   AI Reasoner   Path Planner
 Engine
 │
 ▼
Understanding Engine
 │
 ▼
Quiz Generator
 │
 ▼
Progress Tracker
 │
 ▼
Database
```

## 4. Core AI Modules
Instead of one AI model, Compass consists of multiple intelligent modules:

- **Module 1 - Knowledge Engine:** Converts documents into structured knowledge (Concepts, Relationships, Definitions).
- **Module 2 - Gap Detector:** Determines what the learner does NOT understand.
- **Module 3 - AI Reasoner:** Powered by Gemma 4 for explanation, reasoning, simplification, multilingual teaching, and context.
- **Module 4 - Path Planner:** Creates learning order, milestones, and recommendations.
- **Module 5 - Understanding Engine:** Combines knowledge, reasoning, teaching, and assessment.
- **Module 6 - Quiz Engine:** Generates adaptive quizzes based on the Knowledge Graph.
- **Module 7 - Progress Engine:** Tracks mastery, learning time, scores, and knowledge growth.

## 5. Knowledge Flow
User Uploads Lecture Note → OCR → Text Extraction → Gemma → Concept Extraction → Knowledge Graph → Gap Detection → Explanation → Quiz → Roadmap → Progress Updated

## 6. Platform Layers
We build a platform, then modules, then products.
**Gemma Compass Platform → Compass Campus** *(MVP)* → Future modules (Compass Health, Compass Agriculture, Compass Career, Compass Finance).
