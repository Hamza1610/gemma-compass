from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import uuid
from datetime import datetime
from app.db import get_db
from app.models import Message, Session as DBSession, Document
from app.schemas import MessageCreate, MessageResponse
from app.services.retriever import retrieve_top_chunks
from app.core.gemma_client import call_gemma
from app.services.prompts import CHAT_PROMPT_TEMPLATE
from app.core.config import settings

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/{session_id}/message", response_model=MessageResponse)
def send_message(
    session_id: str,
    message_data: MessageCreate,
    db: Session = Depends(get_db)
):
    # 1. Fetch Session details
    db_session = db.get(DBSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Get the most recently uploaded document for this session
    doc = db.exec(
        select(Document)
        .where(Document.session_id == session_id)
        .order_by(Document.uploaded_at.desc())
    ).first()

    # 3. Retrieve relevant chunks if document exists, otherwise empty
    retrieved_content = "No context document uploaded yet."
    if doc:
        chunks = retrieve_top_chunks(db, doc.id, message_data.content, limit=settings.CHAT_CONTEXT_LIMIT)
        if chunks:
            retrieved_content = "\n\n".join([
                f"[Excerpt {idx + 1} from {doc.filename}]:\n{c.text}"
                for idx, c in enumerate(chunks)
            ])

    # 4. Fetch last messages for context
    history_records = db.exec(
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at.desc())
        .limit(settings.CHAT_HISTORY_LIMIT)
    ).all()
    # Reverse history to be in ascending order
    history_records.reverse()

    history_str = ""
    for h in history_records:
        role_label = "Student" if h.role == "user" else "Tutor"
        history_str += f"{role_label}: {h.content}\n"

    # 5. Save user message in DB
    user_msg_id = str(uuid.uuid4())
    user_message = Message(
        id=user_msg_id,
        session_id=session_id,
        role="user",
        content=message_data.content,
        language=db_session.language_pref,
        created_at=datetime.utcnow()
    )
    db.add(user_message)
    db.commit()

    # 6. Format prompt and call Gemma
    chat_prompt = CHAT_PROMPT_TEMPLATE.format(
        retrieved_chunks=retrieved_content,
        language_pref=db_session.language_pref,
        history=history_str,
        message=message_data.content
    )

    try:
        assistant_content = call_gemma([{"role": "user", "content": chat_prompt}])
    except Exception as e:
        # Fallback explanation if offline
        assistant_content = (
            "Gemma model is currently processing offline or disconnected. "
            "Gemma misali yana aiki a kashe (offline). Da fatan za a sake gwadawa nan gaba."
        )

    # 7. Save Assistant message in DB
    assistant_msg_id = str(uuid.uuid4())
    assistant_message = Message(
        id=assistant_msg_id,
        session_id=session_id,
        role="assistant",
        content=assistant_content,
        language=db_session.language_pref,
        created_at=datetime.utcnow()
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    return assistant_message

@router.get("/{session_id}/history", response_model=list[MessageResponse])
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    # Verify session exists
    db_session = db.get(DBSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = db.exec(
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(Message.created_at)
    ).all()
    
    return messages
