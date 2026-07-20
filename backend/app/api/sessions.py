from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
import uuid
from datetime import datetime
from app.db import get_db
from app.models import Session as DBSession
from app.schemas import SessionCreate, SessionResponse

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("", response_model=SessionResponse)
def create_session(session_data: SessionCreate, db: Session = Depends(get_db)):
    session_id = str(uuid.uuid4())
    db_session = DBSession(
        id=session_id,
        language_pref=session_data.language_pref,
        created_at=datetime.utcnow()
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/{id}", response_model=SessionResponse)
def get_session(id: str, db: Session = Depends(get_db)):
    db_session = db.get(DBSession, id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session

@router.put("/{id}", response_model=SessionResponse)
def update_session(id: str, session_data: SessionCreate, db: Session = Depends(get_db)):
    db_session = db.get(DBSession, id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    db_session.language_pref = session_data.language_pref
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

