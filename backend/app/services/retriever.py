import numpy as np
from sqlalchemy import text
from sqlmodel import Session, select
from app.models import Chunk
from app.services.embedder import get_embedding
import logging

logger = logging.getLogger(__name__)

def insert_chunk_vector(session: Session, chunk_id: str, embedding: list[float]):
    """Insert a chunk's embedding vector into the sqlite-vec virtual table."""
    vector_data = np.array(embedding, dtype=np.float32)
    sql = text("INSERT INTO chunk_vectors(chunk_id, embedding) VALUES (:chunk_id, :embedding)")
    session.execute(sql, {"chunk_id": chunk_id, "embedding": vector_data})

def retrieve_top_chunks(session: Session, document_id: str, query: str, limit: int = 4) -> list[Chunk]:
    """
    Given a query, embed it, perform vector search inside the virtual table,
    and return the corresponding Chunk database records.
    """
    try:
        # Get query embedding
        query_emb = get_embedding(query)
    except Exception as e:
        logger.error(f"Error fetching query embedding: {str(e)}")
        # Fallback to returning sequential chunks if Embedding model is offline
        logger.warning("Falling back to retrieving first 4 chunks sequentially.")
        return session.exec(select(Chunk).where(Chunk.document_id == document_id).order_by(Chunk.order_index).limit(limit)).all()

    query_vector = np.array(query_emb, dtype=np.float32)

    # Perform vector MATCH search on sqlite-vec
    sql = text("""
        SELECT chunk_id, distance
        FROM chunk_vectors
        WHERE embedding MATCH :query_vector
          AND chunk_id IN (
              SELECT id FROM chunk WHERE document_id = :document_id
          )
        ORDER BY distance
        LIMIT :limit;
    """)
    
    try:
        result = session.execute(sql, {
            "query_vector": query_vector.tobytes(), # raw bytes for safety in some sqlite bindings
            "document_id": document_id,
            "limit": limit
        }).fetchall()
    except Exception as e:
        # Try passing the numpy array directly if raw bytes fails
        logger.warning(f"Failed with tobytes(), retrying with numpy array directly: {str(e)}")
        result = session.execute(sql, {
            "query_vector": query_vector,
            "document_id": document_id,
            "limit": limit
        }).fetchall()

    chunk_ids = [row[0] for row in result]
    if not chunk_ids:
        return []

    # Fetch chunks from the SQLModel Chunk table
    chunks = session.exec(select(Chunk).where(Chunk.id.in_(chunk_ids))).all()
    
    # Sort them by their original retrieval order (distance)
    chunk_map = {chunk.id: chunk for chunk in chunks}
    sorted_chunks = [chunk_map[cid] for cid in chunk_ids if cid in chunk_map]
    return sorted_chunks
