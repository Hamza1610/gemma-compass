from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class SessionCreate(BaseModel):
    language_pref: str = "mixed"  # "en" | "ha" | "mixed"

class SessionResponse(BaseModel):
    id: str
    language_pref: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConceptResponse(BaseModel):
    name: str
    explanation_en: str
    explanation_ha: str

    class Config:
        from_attributes = True

class DocumentUploadResponse(BaseModel):
    document_id: str
    concepts: List[ConceptResponse]
    summary_en: Optional[str]
    summary_ha: Optional[str]

class DocumentResponse(BaseModel):
    id: str
    filename: str
    doc_type: str
    summary_en: Optional[str]
    summary_ha: Optional[str]
    uploaded_at: datetime
    embedding_status: str

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True

class QuizQuestionResponse(BaseModel):
    id: str
    concept_id: Optional[str]
    question: str
    options: List[str]

class QuizAnswerSubmit(BaseModel):
    question_id: str
    selected_answer: str

class QuizAnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: str

class RoadmapItem(BaseModel):
    concept_id: str
    concept_name: str
    explanation_en: str
    explanation_ha: str
    status: str
    detected_at: datetime
