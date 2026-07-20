# Gemma Compass 🧭 — Bilingual Offline Academic Tutor

An offline-first, bilingual (English & Hausa) academic tutor web application built for the **Google Gemma Hackathon (GDG Campus ABU)**. 

Gemma Compass is designed specifically for Nigerian university students to overcome study challenges. It takes course slides, lecture notes, or PDF handouts and uses local LLM weights via Ollama to extract key concepts, generate bilingual explanations, chat with the material, and run adaptive diagnostic quizzes to map learning progress.

---

## 🚀 Key Features

1. **Bilingual Key Concepts**: Segment notes into core concepts explained side-by-side in simple English and natural, contextual Hausa.
2. **Natural Code-Switching RAG Chat**: Chat with your notes. The LLM naturally alternates between English and Hausa (code-switching) representing how Nigerian study groups interact.
3. **Diagnostic Quiz & Study Roadmap**: Generated multiple-choice questions map your understanding of concepts. Wrong answers automatically populate a custom revision roadmap.
4. **100% Offline Inference**: Uses local weights for embeddings (`nomic-embed-text`) and chat (`gemma4:e2b` / `gemma4:e4b`) keeping inference free, private, and accessible during internet blackouts.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS v4, Lucide Icons, Glassmorphic Premium Dark Theme.
- **Backend**: FastAPI, SQLModel (ORM), SQLite (database).
- **Vector Database**: `sqlite-vec` (pure C-based SQLite extension for vector similarity search, conexión-level loaded).
- **LLM Pipeline**: Ollama local HTTP server.

---

## 📁 Repository Structure

```text
gemma-compass/
├── backend/
│   ├── app/
│   │   ├── api/             # API routes (sessions, documents, chat, quiz, roadmap)
│   │   ├── core/            # Configuration and Ollama LLM HTTP client
│   │   ├── services/        # Logic (chunker, embedder, retriever, explainer, quiz)
│   │   ├── db.py            # SQLite connection with sqlite-vec extension
│   │   ├── models.py        # SQLModel schema definitions
│   │   └── schemas.py       # Pydantic request/response structures
│   ├── uploads/             # Locally stored lecture notes files
│   ├── .env.example         # Template for environment variables
│   ├── requirements.txt     # Python requirements
│   ├── test_db.py           # Verification script for database loading
│   ├── test_rag.py          # Verification script for vector chunk indexing
│   └── test_api.py          # Integration tests for REST API endpoints
├── frontend/
│   ├── src/
│   │   ├── app/             # Page layouts (landing, dashboard, chat, quiz)
│   │   ├── components/      # UI components (UploadDropzone, LanguageToggle, etc.)
│   │   └── lib/             # API Client wrappers
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
1. **Python 3.10+** and **Node.js 18+**.
2. **Local Models**: Download the local GGUF models directly via our automated script:
   ```bash
   cd backend
   ./download.sh
   ```
   *(Note: This downloads Google's Gemma 4 E4B model and Nomic's embedding model into a local folder, removing any need for external Ollama installations).*

---

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy environment configuration and configure if necessary (defaults work for localhost):
   ```bash
   cp .env.example .env
   ```
5. Run Backend Verification Tests:
   * Verify SQLite vector extension:
     ```bash
     python test_db.py
     ```
   * Verify document chunking and vector retrieval:
     ```bash
     python test_rag.py
     ```
   * Verify API routes & fallback pipelines:
     ```bash
     python test_api.py
     ```
6. Start the backend development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run optimized production compilation build:
   ```bash
   npm run build
   ```
4. Start the frontend server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 💡 How to Test & Demo (Judge Guide)

1. Launch both the backend (`localhost:8000`) and frontend (`localhost:3000`).
2. On the landing page, choose your preferred **Learning Language Mode** (e.g. *Hausa / English Mixed*) and click **Start Bilingual Session**.
3. Upload some course slides or lecture notes (PDF or text). The system will segment them, generate summaries, and compute vector chunks.
4. Review the extracted cards in **Summary & Concepts** to see explanations in English and Hausa.
5. Navigate to the **Chat Tutor** tab and ask a question. Observe how Compass code-switches mid-sentence (if "mixed" is chosen).
6. Go to the **Diagnostics Quiz** tab, click "Generate Quiz Questions", and select options. Incorrect answers will automatically update your customized **Study Revision Roadmap** visible on the main dashboard!
