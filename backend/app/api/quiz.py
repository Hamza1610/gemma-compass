from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import json
from app.db import get_db
from app.models import QuizQuestion, Session as DBSession, Document
from app.schemas import QuizQuestionResponse, QuizAnswerSubmit, QuizAnswerResponse
from app.services.quiz_generator import generate_quiz_for_document, grade_quiz_answer

router = APIRouter(prefix="/api/quiz", tags=["quiz"])

@router.post("/{document_id}/generate", response_model=list[QuizQuestionResponse])
def generate_quiz(document_id: str, db: Session = Depends(get_db)):
    # 1. Verify document exists
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # 2. Call generator service
    questions = generate_quiz_for_document(db, document_id)
    
    # 3. Format response: hiding "correct_answer" to protect client security
    response_list = []
    for q in questions:
        try:
            options = json.loads(q.options_json)
        except Exception:
            options = []
            
        response_list.append(
            QuizQuestionResponse(
                id=q.id,
                concept_id=q.concept_id,
                question=q.question,
                options=options
            )
        )
    return response_list

@router.post("/{session_id}/answer", response_model=QuizAnswerResponse)
def submit_answer(
    session_id: str,
    answer_data: QuizAnswerSubmit,
    db: Session = Depends(get_db)
):
    # 1. Verify session exists
    db_session = db.get(DBSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Fetch the question to get the correct answer
    question = db.get(QuizQuestion, answer_data.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # 3. Grade the answer
    try:
        attempt = grade_quiz_answer(db, session_id, answer_data.question_id, answer_data.selected_answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return QuizAnswerResponse(
        is_correct=attempt.is_correct,
        correct_answer=question.correct_answer
    )
