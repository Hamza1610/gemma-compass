from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlmodel import Session, select
import uuid
import shutil
from datetime import datetime
from app.db import get_db
from app.models import Document, Session as DBSession, Concept
from app.schemas import DocumentUploadResponse, DocumentResponse, ConceptResponse
from app.services.explainer import process_and_explain_document
from app.core.config import settings

router = APIRouter(prefix="/api/documents", tags=["documents"])

@router.post("/upload", response_model=DocumentUploadResponse)
def upload_document(
    session_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Verify session exists
    db_session = db.get(DBSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Extract file extension and determine type
    filename = file.filename
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    
    if ext == "pdf":
        doc_type = "pdf"
    elif ext in ["png", "jpg", "jpeg"]:
        doc_type = "image"
    elif ext in ["pptx", "ppt"]:
        doc_type = "pptx"
    elif ext in ["docx", "doc"]:
        doc_type = "docx"
    elif ext in ["txt", "md", "csv"]:
        doc_type = "text"
    else:
        # Default fallback
        doc_type = "text"

    # 3. Save file locally
    doc_id = str(uuid.uuid4())
    saved_filename = f"{doc_id}_{filename}"
    file_path = settings.UPLOADS_DIR / saved_filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write file locally: {str(e)}")

    # 4. Insert Document record in DB
    db_doc = Document(
        id=doc_id,
        session_id=session_id,
        filename=filename,
        doc_type=doc_type,
        raw_text="",  # Extracted in pipeline
        uploaded_at=datetime.utcnow(),
        embedding_status="pending"
    )
    db.add(db_doc)
    db.commit()

    # 5. Process and explain document (triggers extraction, chunking, embedding, concepts/summary LLM calls)
    doc, concepts = process_and_explain_document(db, str(file_path), doc_id)
    
    if not doc:
        raise HTTPException(status_code=500, detail="Failed to process document")

    # 6. Format and return
    concepts_response = [
        ConceptResponse(
            name=c.name,
            explanation_en=c.explanation_en,
            explanation_ha=c.explanation_ha
        )
        for c in concepts
    ]

    return DocumentUploadResponse(
        document_id=doc_id,
        concepts=concepts_response,
        summary_en=doc.summary_en,
        summary_ha=doc.summary_ha
    )

@router.get("/{id}", response_model=DocumentResponse)
def get_document(id: str, db: Session = Depends(get_db)):
    doc = db.get(Document, id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.get("/{id}/concepts", response_model=list[ConceptResponse])
def get_document_concepts(id: str, db: Session = Depends(get_db)):
    doc = db.get(Document, id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    concepts = db.exec(
        select(Concept)
        .where(Concept.document_id == id)
        .order_by(Concept.order_index)
    ).all()
    return concepts

