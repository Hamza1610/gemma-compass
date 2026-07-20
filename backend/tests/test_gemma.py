from sqlmodel import Session, select
import sys
import uuid
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.db import init_db, get_db
from app.models import Session as DBSession, Document, Concept, KnowledgeGap
from app.services.quiz_generator import generate_quiz_for_document, grade_quiz_answer

def test_gemma_phase():
    import logging
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    print("Testing Phase 4 Gemma & Quiz Integration...")
    init_db()

    db_gen = get_db()
    session: Session = next(db_gen)

    # 1. Scaffolding database
    session_id = str(uuid.uuid4())
    db_session = DBSession(id=session_id, language_pref="en")
    session.add(db_session)

    doc_id = str(uuid.uuid4())
    doc = Document(
        id=doc_id,
        session_id=session_id,
        filename="notes.txt",
        doc_type="text",
        raw_text="Thermodynamics is the study of heat and temperature.",
        embedding_status="ready"
    )
    session.add(doc)

    concept_id = str(uuid.uuid4())
    concept = Concept(
        id=concept_id,
        document_id=doc_id,
        name="Thermodynamics First Law",
        explanation_en="Energy cannot be created or destroyed.",
        explanation_ha="Karfi baya halitta kuma baya mutuwa.",
        order_index=0
    )
    session.add(concept)
    session.commit()

    # 2. Test generate quiz (with offline fallback logic)
    print("Generating quiz...")
    questions = generate_quiz_for_document(session, doc_id)
    print(f"Generated {len(questions)} quiz questions:")
    for idx, q in enumerate(questions):
        print(f"  Q{idx}: {q.question}")
        print(f"  Options: {q.options_json}")
        print(f"  Answer: {q.correct_answer}")

    # 3. Test grade quiz answer
    if questions:
        q = questions[0]
        # submit correct answer
        attempt = grade_quiz_answer(session, session_id, q.id, q.correct_answer)
        print(f"Correct submission result: is_correct={attempt.is_correct}")

        # submit incorrect answer
        attempt_wrong = grade_quiz_answer(session, session_id, q.id, "Wrong Answer Text")
        print(f"Wrong submission result: is_correct={attempt_wrong.is_correct}")

        # Check knowledge gap in database
        gap = session.exec(select(KnowledgeGap).where(
            KnowledgeGap.session_id == session_id,
            KnowledgeGap.concept_id == q.concept_id
        )).first()
        print(f"KnowledgeGap status in DB: {gap.status if gap else 'None'}")

    print("Phase 4 verification complete!")

if __name__ == "__main__":
    test_gemma_phase()
