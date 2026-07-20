const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Session {
  id: string;
  language_pref: string;
  created_at: string;
}

export interface Concept {
  name: string;
  explanation_en: string;
  explanation_ha: string;
}

export interface DocumentUploadResponse {
  document_id: string;
  concepts: Concept[];
  summary_en: string;
  summary_ha: string;
}

export interface Document {
  id: string;
  filename: string;
  doc_type: string;
  summary_en: string;
  summary_ha: string;
  uploaded_at: string;
  embedding_status: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  language: string;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  concept_id: string | null;
  question: string;
  options: string[];
}

export interface QuizAttemptResponse {
  is_correct: boolean;
  correct_answer: string;
}

export interface RoadmapItem {
  concept_id: string;
  concept_name: string;
  explanation_en: string;
  explanation_ha: string;
  status: string;
  detected_at: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  // Session API
  createSession: (languagePref: string = "mixed"): Promise<Session> => {
    return request<Session>("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language_pref: languagePref }),
    });
  },

  getSession: (id: string): Promise<Session> => {
    return request<Session>(`/api/sessions/${id}`);
  },

  updateSession: (id: string, languagePref: string): Promise<Session> => {
    return request<Session>(`/api/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language_pref: languagePref }),
    });
  },

  // Document API
  uploadDocument: (sessionId: string, file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("file", file);

    return request<DocumentUploadResponse>("/api/documents/upload", {
      method: "POST",
      body: formData, // fetch sets content-type multipart automatically when FormData is used
    });
  },

  getDocument: (id: string): Promise<Document> => {
    return request<Document>(`/api/documents/${id}`);
  },

  getDocumentConcepts: (id: string): Promise<Concept[]> => {
    return request<Concept[]>(`/api/documents/${id}/concepts`);
  },

  // Chat API
  sendMessage: (sessionId: string, content: string): Promise<Message> => {
    return request<Message>(`/api/chat/${sessionId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  },

  getChatHistory: (sessionId: string): Promise<Message[]> => {
    return request<Message[]>(`/api/chat/${sessionId}/history`);
  },

  // Quiz API
  generateQuiz: (documentId: string): Promise<QuizQuestion[]> => {
    return request<QuizQuestion[]>(`/api/quiz/${documentId}/generate`, {
      method: "POST",
    });
  },

  submitAnswer: (
    sessionId: string,
    questionId: string,
    selectedAnswer: string
  ): Promise<QuizAttemptResponse> => {
    return request<QuizAttemptResponse>(`/api/quiz/${sessionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: questionId,
        selected_answer: selectedAnswer,
      }),
    });
  },

  // Roadmap API
  getRoadmap: (sessionId: string): Promise<RoadmapItem[]> => {
    return request<RoadmapItem[]>(`/api/roadmap/${sessionId}`);
  },
};
