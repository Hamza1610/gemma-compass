import sys
import uuid
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.db import init_db, get_db
from app.models import Session as DBSession, Document, Chunk
from app.services.chunker import chunk_text
from app.services.retriever import insert_chunk_vector, retrieve_top_chunks
from sqlmodel import Session

def test_rag_pipeline():
    print("Testing Phase 3 RAG Pipeline...")
    init_db()

    # Create session and db
    db_gen = get_db()
    session: Session = next(db_gen)

    # 1. Create a mock session & document
    session_id = str(uuid.uuid4())
    db_session = DBSession(id=session_id, language_pref="mixed")
    session.add(db_session)
    session.commit()

    doc_id = str(uuid.uuid4())
    raw_text = (
        "Nigeria has 36 states. The capital city of Nigeria is Abuja, located in the Federal Capital Territory. "
        "Lagos is the most populous city in Nigeria and was the former capital. "
        "The official language of Nigeria is English, but Hausa, Yoruba, and Igbo are major languages spoken. "
        "Newton's First Law states that an object remains at rest or in uniform motion unless acted upon by a force. "
        "Newton's Second Law states that force equals mass times acceleration (F = ma). "
        "Newton's Third Law states that for every action there is an equal and opposite reaction."
    )
    doc = Document(
        id=doc_id,
        session_id=session_id,
        filename="test_notes.txt",
        doc_type="text",
        raw_text=raw_text,
        embedding_status="pending"
    )
    session.add(doc)
    session.commit()

    # 2. Chunk text
    chunks_text = chunk_text(raw_text, chunk_size_words=20, overlap_words=5)
    print(f"Generated {len(chunks_text)} chunks:")
    for idx, chunk in enumerate(chunks_text):
        print(f"  Chunk {idx}: {chunk[:50]}...")

    # 3. Store chunks and mock embeddings (since Ollama may be offline)
    # We will use dummy vectors of 768 float values
    import random
    
    for idx, chunk_str in enumerate(chunks_text):
        chunk_id = str(uuid.uuid4())
        chunk_record = Chunk(
            id=chunk_id,
            document_id=doc_id,
            text=chunk_str,
            order_index=idx
        )
        session.add(chunk_record)
        session.commit()
        
        # mock embedding list (length 768)
        # Vector search works by matching close dimensions. Let's make first vector close to "Nigeria"
        # and second vector close to "Newton".
        # We can add mock values.
        mock_embedding = [0.0] * 768
        if "Nigeria" in chunk_str:
            mock_embedding[0] = 1.0
        if "Newton" in chunk_str:
            mock_embedding[1] = 1.0
            
        insert_chunk_vector(session, chunk_id, mock_embedding)
        session.commit()

    print("Stored chunks and embeddings in sqlite-vec.")

    # 4. Perform vector search
    # Since Ollama is offline in this sandbox test, retrieve_top_chunks will fallback to sequential chunks
    # unless we mock get_embedding. Let's test the fallback retrieve and see if it retrieves.
    retrieved = retrieve_top_chunks(session, doc_id, "Newton's Laws", limit=2)
    print(f"Retrieved {len(retrieved)} chunks:")
    for idx, chunk in enumerate(retrieved):
        print(f"  Result {idx} (idx {chunk.order_index}): {chunk.text}")

    print("Phase 3 verification complete!")

if __name__ == "__main__":
    test_rag_pipeline()
