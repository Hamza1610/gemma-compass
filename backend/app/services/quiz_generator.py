import json
import uuid
import logging
from datetime import datetime
from sqlmodel import Session, select
from app.models import QuizQuestion, Concept, QuizAttempt, KnowledgeGap
from app.core.gemma_client import call_gemma
from app.services.prompts import QUIZ_PROMPT_TEMPLATE

logger = logging.getLogger(__name__)

def generate_quiz_for_document(session: Session, document_id: str) -> list[QuizQuestion]:
    """
    Check if quiz questions already exist for a document.
    If not, query Gemma using concepts to generate 5 MCQs and save them.
    """
    existing_questions = session.exec(select(QuizQuestion).where(QuizQuestion.document_id == document_id)).all()
    if existing_questions:
        logger.info(f"Returning {len(existing_questions)} existing quiz questions.")
        return existing_questions

    # Fetch concepts of the document to pass as context
    concepts = session.exec(select(Concept).where(Concept.document_id == document_id).order_by(Concept.order_index)).all()
    if not concepts:
        logger.warning(f"No concepts found for document {document_id}. Cannot generate quiz.")
        return []

    concepts_data = [
        {
            "name": c.name,
            "explanation_en": c.explanation_en
        }
        for c in concepts
    ]
    concepts_json = json.dumps(concepts_data, indent=2)

    quiz_prompt = QUIZ_PROMPT_TEMPLATE.format(concepts_json=concepts_json)
    questions = []

    try:
        logger.info("Generating quiz questions via Gemma...")
        response_text = call_gemma([{"role": "user", "content": quiz_prompt}], response_format_json=True)
        questions_data = json.loads(response_text)

        # Handle formatting edge cases
        if isinstance(questions_data, dict):
            if "questions" in questions_data:
                questions_data = questions_data["questions"]
            else:
                questions_data = list(questions_data.values())

        if isinstance(questions_data, list):
            for item in questions_data:
                if not isinstance(item, dict):
                    continue

                # Map question concept_name back to concept_id
                concept_name = item.get("concept_name", "")
                concept_id = None
                for c in concepts:
                    if c.name.lower() == concept_name.lower():
                        concept_id = c.id
                        break

                question_record = QuizQuestion(
                    id=str(uuid.uuid4()),
                    document_id=document_id,
                    concept_id=concept_id,
                    question=item.get("question", ""),
                    options_json=json.dumps(item.get("options", [])),
                    correct_answer=item.get("correct_answer", "")
                )
                session.add(question_record)
                questions.append(question_record)
            session.commit()
        else:
            raise ValueError("Parsed JSON is not a list/array of questions.")
    except Exception as e:
        logger.error(f"Failed to generate quiz via Gemma: {str(e)}")
        # Construct simple offline fallback questions
        logger.info("Constructing fallback quiz questions.")
        for idx, c in enumerate(concepts[:5]):
            question_record = QuizQuestion(
                id=str(uuid.uuid4()),
                document_id=document_id,
                concept_id=c.id,
                question=f"Which of the following is the best explanation for: '{c.name}'?",
                options_json=json.dumps([
                    c.explanation_en,
                    "An unrelated secondary topic in Nigerian curriculums.",
                    "An outdated concept replaced by modern research.",
                    "None of the options listed above."
                ]),
                correct_answer=c.explanation_en
            )
            session.add(question_record)
            questions.append(question_record)
        session.commit()

    return questions

def grade_quiz_answer(session: Session, session_id: str, question_id: str, selected_answer: str) -> QuizAttempt:
    """
    Grades the selected answer against the question's correct answer.
    Creates a QuizAttempt record and updates/creates a KnowledgeGap entry.
    """
    question = session.get(QuizQuestion, question_id)
    if not question:
        raise ValueError(f"Question with ID {question_id} not found.")

    is_correct = (selected_answer.strip() == question.correct_answer.strip())

    attempt = QuizAttempt(
        id=str(uuid.uuid4()),
        session_id=session_id,
        question_id=question_id,
        selected_answer=selected_answer,
        is_correct=is_correct,
        created_at=datetime.utcnow()
    )
    session.add(attempt)
    session.commit()

    # Track student knowledge gaps
    if question.concept_id:
        status = "mastered" if is_correct else "gap"
        
        # Check if a gap entry already exists for this session + concept
        gap = session.exec(select(KnowledgeGap).where(
            KnowledgeGap.session_id == session_id,
            KnowledgeGap.concept_id == question.concept_id
        )).first()

        if gap:
            gap.status = status
            gap.detected_at = datetime.utcnow()
            session.add(gap)
        else:
            new_gap = KnowledgeGap(
                id=str(uuid.uuid4()),
                session_id=session_id,
                concept_id=question.concept_id,
                status=status,
                detected_at=datetime.utcnow()
            )
            session.add(new_gap)
        session.commit()

    return attempt
