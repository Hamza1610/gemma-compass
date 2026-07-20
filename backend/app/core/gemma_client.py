import httpx
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

def call_gemma(messages: list[dict], response_format_json: bool = False) -> str:
    """
    Calls the local Ollama LLM with a list of messages.
    Supports both OpenAI-compatible and native Ollama chat APIs.
    """
    url = settings.OLLAMA_URL.rstrip("/")
    
    # 1. Try OpenAI-compatible endpoint if /v1 is in the URL
    if "/v1" in url:
        endpoint = f"{url}/chat/completions"
        payload = {
            "model": settings.MODEL_TAG,
            "messages": messages,
            "temperature": 0.2
        }
        if response_format_json:
            payload["response_format"] = {"type": "json_object"}
            
        try:
            logger.info(f"Sending request to OpenAI-compatible endpoint: {endpoint}")
            response = httpx.post(endpoint, json=payload, timeout=90.0)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.error(f"OpenAI-compatible chat completion failed: {str(e)}")
            # Strip /v1 and retry with native endpoint
            native_url = url.replace("/v1", "")
            logger.info(f"Retrying on native Ollama chat route: {native_url}/api/chat")
            return _call_native_gemma(native_url, messages, response_format_json)
    else:
        return _call_native_gemma(url, messages, response_format_json)

def _call_native_gemma(base_url: str, messages: list[dict], response_format_json: bool = False) -> str:
    """Helper calling the native Ollama /api/chat endpoint directly."""
    endpoint = f"{base_url}/api/chat"
    payload = {
        "model": settings.MODEL_TAG,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }
    if response_format_json:
        payload["format"] = "json"
        
    response = httpx.post(endpoint, json=payload, timeout=90.0)
    response.raise_for_status()
    data = response.json()
    return data["message"]["content"]
