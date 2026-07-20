from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Session(SQLModel, table=True):
    __tablename__ = "session"
    id: str = Field(primary_key=True)
    language_pref: str = Field(default="mixed")  # "en" | "ha" | "mixed"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Document(SQLModel, table=True):
    __tablename__ = "document"
    id: str = Field(primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    filename: str
    doc_type: str  # "pdf" | "image" | "text"
    raw_text: str
    summary_en: Optional[str] = None
    summary_ha: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    embedding_status: str = Field(default="pending")  # "pending" | "chunked" | "ready"

class Chunk(SQLModel, table=True):
    __tablename__ = "chunk"
    id: str = Field(primary_key=True)
    document_id: str = Field(foreign_key="document.id")
    text: str
    order_index: int

class Concept(SQLModel, table=True):
    __tablename__ = "concept"
    id: str = Field(primary_key=True)
    document_id: str = Field(foreign_key="document.id")
    name: str
    explanation_en: str
    explanation_ha: str
    order_index: int

class Message(SQLModel, table=True):
    __tablename__ = "message"
    id: str = Field(primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    role: str  # "user" | "assistant"
    content: str
    language: str  # "en" | "ha" | "mixed"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class QuizQuestion(SQLModel, table=True):
    __tablename__ = "quizquestion"
    id: str = Field(primary_key=True)
    document_id: str = Field(foreign_key="document.id")
    concept_id: Optional[str] = Field(default=None, foreign_key="concept.id")
    question: str
    options_json: str  # JSON-encoded list of 4 options
    correct_answer: str

class QuizAttempt(SQLModel, table=True):
    __tablename__ = "quizattempt"
    id: str = Field(primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    question_id: str = Field(foreign_key="quizquestion.id")
    selected_answer: str
    is_correct: bool
    created_at: datetime = Field(default_factory=datetime.utcnow)

class KnowledgeGap(SQLModel, table=True):
    __tablename__ = "knowledgegap"
    id: str = Field(primary_key=True)
    session_id: str = Field(foreign_key="session.id")
    concept_id: str = Field(foreign_key="concept.id")
    status: str  # "gap" | "mastered"
    detected_at: datetime = Field(default_factory=datetime.utcnow)
