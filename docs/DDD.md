# Database Design Document (DDD)
**Project:** Gemma Compass  
**Version:** 1.0  
**Status:** System Design  

## 1. Purpose
The Database Design Document (DDD) defines how data is structured, stored, related, and accessed within Gemma Compass to support Adaptive Knowledge Navigation (AKN).

## 2. Database Philosophy
Unlike traditional learning platforms that primarily store courses or files, Gemma Compass is designed around understanding. The database models People, Knowledge, Relationships, Learning, and Progress.

## 3. High-Level Database Architecture
Users → Documents / Learning Goals / User Settings → Document Concepts → Knowledge Graph → Knowledge Gaps → Learning Paths → Quiz Sessions → Progress Tracker

## 4. Database Choice
- **Primary Database:** PostgreSQL
- **Vector Search:** pgvector
- **Cache:** Redis
- **File Storage:** Cloud Storage / Local Storage

*Why PostgreSQL?* Strong relational modeling, JSONB support for flexible AI metadata, full-text search, pgvector support for embeddings, excellent scalability, and easy FastAPI integration.

## 5. Core Entities & Table Specifications

**7.1 Users**
- id (UUID), full_name, email, password_hash, preferred_language, education_level, university, department, timestamps.

**7.2 Documents**
- id (UUID), user_id, title, document_type, file_path, extracted_text, language, upload_date.

**7.3 Concepts**
- id (UUID), document_id, concept_name, description, difficulty_level, embedding (VECTOR).

**7.4 Knowledge Graph**
- id (UUID), source_concept, target_concept, relationship (e.g., prerequisite, part_of).

**7.5 Learning Goals**
- id (UUID), user_id, goal_name, status, timestamps.

**7.6 Knowledge Gaps**
- id (UUID), user_id, concept_id, confidence_score, detected_on.

**7.7 Learning Paths**
- id (UUID), user_id, goal_id, generated_path (JSONB), estimated_duration.

**7.8 Quiz Sessions**
- id (UUID), user_id, concept_id, score, completed_at.

**7.9 Progress Tracker**
- id (UUID), user_id, mastery_score, completed_topics, learning_hours, last_activity.

**7.10 Recommendations**
- id (UUID), user_id, recommendation_type, content, priority.

**7.11 Learning Sessions**
- id (UUID), user_id, document_id, duration, ai_response (JSONB), timestamps.

## 6. Relationship Summary
- User → Documents (One-to-Many)
- User → Learning Goals (One-to-Many)
- Document → Concepts (One-to-Many)
- Concept → Knowledge Graph (One-to-Many)
- User → Knowledge Gaps (One-to-Many)
- Learning Goal → Learning Path (One-to-One)

## 7. Indexing Strategy
Indexes for `users.email`, `documents.user_id`, `concepts.document_id`, `concepts.embedding` (Vector Index), `knowledge_gaps.user_id`, etc.

## 8. Scalability Strategy
The schema is intentionally modular to support future domains (Health, Career, etc.) by introducing domain-specific document types and concepts rather than redesigning the database.
