# System Architecture Document (SAD)
**Project:** Gemma Compass  
**Version:** 1.0  
**Status:** System Design  

## 1. Architecture Philosophy
Traditional AI systems work like this: `User → Prompt → LLM → Answer`.  
Gemma Compass introduces a layered architecture: `User → Knowledge Navigation Platform → AI Intelligence Layer → Knowledge Layer → Learning Layer → Response`.  
Instead of simply generating answers, every request passes through multiple intelligent modules before a response is produced.

## 2. System Architecture
```
                        GEMMA COMPASS
                 AI Knowledge Navigation Platform

 ┌─────────────────────────────────────────────────────────────┐
 │                        Client Layer                         │
 │ Flutter Mobile App      Next.js Web App                     │
 └─────────────────────────────────────────────────────────────┘
                            │
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                       API Gateway                           │
 │                         FastAPI                             │
 └─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼────────────────┐
            │               │                │
            ▼               ▼                ▼
 Authentication      Document Service     Chat Service
                            │
                            ▼
             AI Knowledge Navigation Engine
                            │
 ┌──────────────┬──────────────┬──────────────┬──────────────┐
 │              │              │              │              │
 ▼              ▼              ▼              ▼              ▼
Knowledge     Concept       Gap          Path         Understanding
Extractor      Mapper      Detector      Planner         Engine
 │
 ▼
Quiz Generator
 │
 ▼
Progress Engine
 │
 ▼
Recommendation Engine
                            │
                            ▼
                   Google Gemma 4
                            │
                            ▼
                     PostgreSQL + Vector DB
```

## 3. Platform Layers
Gemma Compass consists of six layers:

1. **Presentation Layer:** Flutter Mobile / Responsive Web. Responsible for login, uploads, chat, dashboards.
2. **API Layer:** FastAPI. Responsible for Auth, REST APIs, Session Management.
3. **AI Intelligence Layer:** The heart of Compass. Modules include Knowledge Extractor, Concept Mapper, Gap Detector, AI Reasoner, Path Planner, Understanding Engine.
4. **Knowledge Layer:** Stores Concepts, Knowledge Graph, User Knowledge Graph, Learning Paths, and Document Relationships. Compass remembers understanding.
5. **Learning Layer:** Responsible for quizzes, progress, mastery, and recommendations.
6. **Data Layer:** Stores Users, Documents, Sessions, Progress, Quiz History, and Knowledge Maps.

## 4. Core AI Pipeline
Upload Document → OCR & Document Processing → Document Cleaning → Gemma 4 Analysis → Concept Extraction → Knowledge Graph Creation → Prerequisite Detection → Knowledge Gap Detection → Adaptive Explanation → Interactive Quiz → Mastery Score → Learning Path Update → Dashboard Update

*Note: The AI isn't simply generating text. It is updating a learner model.*

## 5. The Knowledge Navigation Engine
Our engineering framework flows through: **Discover → Understand → Diagnose → Navigate → Evaluate → Adapt**

## 6. Request Lifecycle
Upload Lecture Note → OCR extracts text → Gemma understands lecture → Knowledge Engine extracts concepts → Concept Mapper creates relationships → Gap Detector compares with learner profile → Understanding Engine generates explanation → Quiz Engine validates learning → Progress Engine updates mastery → Dashboard reflects new progress.

## 7. AI Components
- **OCR Engine:** Extract text from images and PDFs
- **Knowledge Extractor:** Identify key concepts and definitions
- **Concept Mapper:** Build relationships between concepts
- **AI Reasoner:** Explain, summarize, answer, and contextualize
- **Gap Detector:** Detect misconceptions and missing prerequisites
- **Path Planner:** Create personalized learning roadmaps
- **Understanding Engine:** Adapt teaching style and examples
- **Quiz Engine:** Generate adaptive assessments
- **Progress Engine:** Track mastery over time
- **Recommendation Engine:** Suggest what to learn next
