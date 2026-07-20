import logging
from ollama import Client
from app.core.config import settings

logger = logging.getLogger(__name__)

def call_gemma(messages: list[dict], response_format_json: bool = False) -> str:
    """
    Calls the local Ollama LLM with a list of messages using the official ollama library.
    """
    # Clean the host URL (strip trailing slashes and /v1)
    host = settings.OLLAMA_URL.rstrip("/")
    if host.endswith("/v1"):
        host = host[:-3].rstrip("/")

    # Instantiate the official Client with a 300.0s (5 minutes) timeout
    client = Client(host=host, timeout=300.0)

    try:
        logger.info(f"Sending chat request to Ollama ({host}) for model {settings.MODEL_TAG}")
        
        # Specify format if JSON is requested
        format_param = "json" if response_format_json else None
        
        response = client.chat(
            model=settings.MODEL_TAG,
            messages=messages,
            format=format_param,
            options={
                "temperature": 0.2
            }
        )
        return response.message.content
    except Exception as e:
        logger.error(f"Ollama chat completion failed: {str(e)}")
        raise e
