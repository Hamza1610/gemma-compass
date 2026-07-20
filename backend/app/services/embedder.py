import logging
from ollama import Client
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_embedding(text_to_embed: str) -> list[float]:
    """
    Generate an embedding vector for the given text using nomic-embed-text via Ollama's official client.
    """
    # Clean the host URL (strip trailing slashes and /v1)
    host = settings.OLLAMA_URL.rstrip("/")
    if host.endswith("/v1"):
        host = host[:-3].rstrip("/")

    client = Client(host=host, timeout=60.0)

    try:
        response = client.embed(
            model=settings.EMBEDDING_MODEL_TAG,
            input=text_to_embed
        )
        return response['embeddings'][0]
    except Exception as e:
        logger.error(f"Ollama embedding generation failed: {str(e)}")
        raise e
