import json
import uuid
import logging
from sqlmodel import Session
from app.models import Document, Chunk, Concept
from app.services.document_processor import extract_text
from app.services.chunker import chunk_text
from app.services.embedder import get_embedding
from app.services.retriever import insert_chunk_vector
from app.core.gemma_client import call_gemma
from app.services.prompts import EXPLAIN_PROMPT_TEMPLATE, SUMMARY_PROMPT_TEMPLATE

logger = logging.getLogger(__name__)

def process_and_explain_document(session: Session, document_path: str, doc_id: str):
    """
    Main ingestion pipeline:
    1. Extract raw text from file
    2. Chunk the text
    3. Generate embeddings and store in sqlite-vec
    4. Call Gemma to extract bilingual concepts
    5. Call Gemma to generate summaries
    """
    doc = session.get(Document, doc_id)
    if not doc:
        logger.error(f"Document with ID {doc_id} not found in database.")
        return None, []

    # 1. Text extraction
    try:
        logger.info(f"Extracting text from file: {document_path}")
        raw_text = extract_text(document_path, doc.doc_type)
        doc.raw_text = raw_text
        session.add(doc)
        session.commit()
    except Exception as e:
        logger.error(f"Failed to extract text from document: {str(e)}")
        doc.embedding_status = "failed"
        session.add(doc)
        session.commit()
        return doc, []

    # 2. Chunking
    try:
        logger.info("Chunking text...")
        chunks_text = chunk_text(raw_text)
        logger.info(f"Split into {len(chunks_text)} chunks.")
    except Exception as e:
        logger.error(f"Failed chunking text: {str(e)}")
        chunks_text = [raw_text]  # Single fallback chunk

    # 3. Embedding generation and storage
    doc.embedding_status = "chunked"
    session.add(doc)
    session.commit()

    for idx, text_slice in enumerate(chunks_text):
        chunk_id = str(uuid.uuid4())
        chunk = Chunk(
            id=chunk_id,
            document_id=doc_id,
            text=text_slice,
            order_index=idx
        )
        session.add(chunk)
        session.commit()

        # Embed & save to sqlite-vec
        try:
            embedding = get_embedding(text_slice)
            insert_chunk_vector(session, chunk_id, embedding)
            session.commit()
        except Exception as e:
            logger.warning(f"Could not generate embedding for chunk {idx}: {str(e)}")
            # Commit normal chunk but skip vector if offline/failed
            session.commit()

    doc.embedding_status = "ready"
    session.add(doc)
    session.commit()

    # 4. Concept generation via Gemma call
    # Truncate text context to fit within local model parameters safely (~3500 words)
    words = raw_text.split()
    truncated_text = " ".join(words[:3500])
    
    concepts_list = []
    logger.info("Generating concepts via Gemma...")
    explain_prompt = EXPLAIN_PROMPT_TEMPLATE.format(raw_text=truncated_text)
    
    try:
        response_text = call_gemma([{"role": "user", "content": explain_prompt}], response_format_json=True)
        # Parse JSON array
        concepts_data = json.loads(response_text)
        
        # Handle cases where model wraps it in a nested key
        if isinstance(concepts_data, dict):
            if "concepts" in concepts_data:
                concepts_data = concepts_data["concepts"]
            elif "data" in concepts_data:
                concepts_data = concepts_data["data"]
            else:
                # convert dict of concepts to list
                concepts_data = list(concepts_data.values())

        if isinstance(concepts_data, list):
            for idx, item in enumerate(concepts_data):
                if not isinstance(item, dict):
                    continue
                concept_record = Concept(
                    id=str(uuid.uuid4()),
                    document_id=doc_id,
                    name=item.get("name", f"Concept {idx + 1}"),
                    explanation_en=item.get("explanation_en", ""),
                    explanation_ha=item.get("explanation_ha", ""),
                    order_index=idx
                )
                session.add(concept_record)
                concepts_list.append(concept_record)
            session.commit()
        else:
            raise ValueError("Expected list of concepts from JSON parsing.")
    except Exception as e:
        logger.error(f"Failed to generate bilingual concepts: {str(e)}")
        # Create a single fallback concept
        fallback = Concept(
            id=str(uuid.uuid4()),
            document_id=doc_id,
            name="General Overview",
            explanation_en="Failed to automatically segment concepts. Please refer to chat for custom Q&A.",
            explanation_ha="An kasa fitar da darussa da kanshi. Da fatan za a duba hira don tambayoyi.",
            order_index=0
        )
        session.add(fallback)
        session.commit()
        concepts_list.append(fallback)

    # 5. Summary generation via Gemma call
    logger.info("Generating summaries via Gemma...")
    summary_prompt = SUMMARY_PROMPT_TEMPLATE.format(raw_text=truncated_text)
    try:
        response_text = call_gemma([{"role": "user", "content": summary_prompt}], response_format_json=True)
        summary_data = json.loads(response_text)
        doc.summary_en = summary_data.get("summary_en", "Brief summary not available.")
        doc.summary_ha = summary_data.get("summary_ha", "Babu taƙaitaccen bayani a halin yanzu.")
    except Exception as e:
        logger.error(f"Failed to generate summary: {str(e)}")
        doc.summary_en = "Text processed. The document details are loaded."
        doc.summary_ha = "An sarrafa takardar. Cikakkun bayanai suna nan."
    
    session.add(doc)
    session.commit()

    return doc, concepts_list
