import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

def get_embedding(text_to_embed: str) -> list[float]:
    """
    Generate an embedding vector for the given text using nomic-embed-text via Ollama.
    Handles both OpenAI-compatible /v1 endpoints and native Ollama endpoints.
    """
    url = settings.OLLAMA_URL.rstrip("/")
    
    # Try OpenAI-compatible endpoint if /v1 is in the URL
    if "/v1" in url:
        endpoint = f"{url}/embeddings"
        payload = {
            "input": text_to_embed,
            "model": settings.EMBEDDING_MODEL_TAG
        }
        try:
            response = httpx.post(endpoint, json=payload, timeout=60.0)
            response.raise_for_status()
            data = response.json()
            return data["data"][0]["embedding"]
        except Exception as e:
            logger.error(f"Failed to fetch embedding via OpenAI-compatible route: {str(e)}")
            # Try falling back to native Ollama API by stripping /v1
            native_url = url.replace("/v1", "")
            logger.info(f"Retrying embedding generation on native route: {native_url}/api/embeddings")
            return _get_native_embedding(native_url, text_to_embed)
    else:
        return _get_native_embedding(url, text_to_embed)

def _get_native_embedding(base_url: str, text_to_embed: str) -> list[float]:
    """Helper for native Ollama embedding endpoint."""
    endpoint = f"{base_url}/api/embeddings"
    payload = {
        "prompt": text_to_embed,
        "model": settings.EMBEDDING_MODEL_TAG
    }
    response = httpx.post(endpoint, json=payload, timeout=60.0)
    response.raise_for_status()
    data = response.json()
    return data["embedding"]
