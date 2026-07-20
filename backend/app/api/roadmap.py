from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db import get_db
from app.models import KnowledgeGap, Concept, Session as DBSession
from app.schemas import RoadmapItem

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

@router.get("/{session_id}", response_model=list[RoadmapItem])
def get_roadmap(session_id: str, db: Session = Depends(get_db)):
    # 1. Verify session exists
    db_session = db.get(DBSession, session_id)
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")

    # 2. Query all knowledge gaps with status "gap"
    gaps = db.exec(
        select(KnowledgeGap)
        .where(KnowledgeGap.session_id == session_id)
        .where(KnowledgeGap.status == "gap")
    ).all()

    if not gaps:
        return []

    # Extract concept ids
    concept_ids = [g.concept_id for g in gaps]

    # Fetch corresponding concepts, ordered by their order_index
    concepts = db.exec(
        select(Concept)
        .where(Concept.id.in_(concept_ids))
        .order_by(Concept.order_index)
    ).all()

    # Create mapping from concept_id to KnowledgeGap for easy reference of detected_at
    gap_map = {g.concept_id: g for g in gaps}

    # Format response
    roadmap_list = []
    for c in concepts:
        gap_record = gap_map.get(c.id)
        roadmap_list.append(
            RoadmapItem(
                concept_id=c.id,
                concept_name=c.name,
                explanation_en=c.explanation_en,
                explanation_ha=c.explanation_ha,
                status="gap",
                detected_at=gap_record.detected_at if gap_record else c.uploaded_at
            )
        )

    return roadmap_list
