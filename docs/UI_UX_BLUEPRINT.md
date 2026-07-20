# UI/UX Blueprint
**Project:** Gemma Compass  
**Platform:** Flutter Mobile (Primary) / Responsive Web (Next.js)  

## 1. Design Philosophy
Gemma Compass is not a chatbot. It is a Knowledge Navigation Platform (Google Maps for Learning). Users should always know: Where they are, Where they want to go, What's next, and How far they've progressed.

## 2. Design Principles
1. **Clarity:** One primary action at a time.
2. **Guidance:** Always suggest the next step.
3. **Personalization:** Adapt content to goals, language, and progress.
4. **Accessibility:** Multilingual interfaces, readable typography, inclusive design.
5. **Consistency:** Unified visual language.

## 3. User Personas
- **Amina (First-Year Student):** Needs English comprehension help and structuring of large volumes of study material.
- **David (Final-Year Student):** Needs a structured roadmap and weak topic detection for exam prep.
- **Fatima (Self-Learner):** Needs beginner-friendly explanations and progress tracking.

## 4. Navigation Flow
`Splash → Login → Dashboard → Upload Document → Navigation Session → Knowledge Map → Understanding → Quiz → Recommendations → Progress → Dashboard`

## 5. Core Screens (MVP)
- **Dashboard:** Active goal, recent documents, daily progress, and suggested next topic.
- **Upload Screen:** Upload PDF, Image, DOCX, or Camera Scan.
- **Navigation Session:** A guided learning flow instead of a chat window. Displays current goal, concept, confidence score, and recommendations.
- **Knowledge Map:** Interactive graph showing completed, current, and locked concepts.
- **Understanding Screen:** AI explanation, local language translation (Hausa/English), examples, and follow-up.
- **Quiz Screen:** Adaptive assessment with immediate explanations.
- **Progress Dashboard:** Learning streak, mastery percentage, topics completed.

## 6. Design System
- **Colors:** Semantic roles (Primary/Brand, Secondary, Success, Warning, Error, Surface, Background).
- **Typography:** Display, Heading, Subheading, Body, Caption (Prioritize readability).
- **Icons:** Compass, Learning, Documents, Understanding, Progress, Goals.

## 7. MVP User Story
A first-year student receives an Operating Systems PDF. She uploads it, chooses Hausa, and starts a session. Gemma extracts concepts, identifies missing prerequisites, generates a learning path, explains in Hausa with examples, quizzes her, and updates her progress dashboard.
