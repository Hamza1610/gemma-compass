import logging
from pathlib import Path
from huggingface_hub import hf_hub_download
from llama_cpp import Llama
from app.core.config import settings

logger = logging.getLogger(__name__)

# Singleton Embedding model instance
_embed_instance = None

def get_embed_model() -> Llama:
    """
    Thread-safe lazy initialization of the local embedding model.
    Checks if the embedding model file exists, otherwise raising a clear instruction error.
    """
    global _embed_instance
    if _embed_instance is None:
        logger.info("Initializing Llama model instance for Embeddings...")
        model_path = Path(settings.MODELS_DIR) / settings.EMBED_FILENAME
        
        # Raise error if model does not exist
        if not model_path.exists():
            err_msg = (
                f"Embedding model file {settings.EMBED_FILENAME} not found at {settings.MODELS_DIR}. "
                "Please run './download.sh' in the backend directory to download the required local models."
            )
            logger.error(err_msg)
            raise FileNotFoundError(err_msg)
            
        logger.info(f"Loading embedding GGUF model from {model_path}...")
        # embedding=True enables embedding extraction inside llama-cpp-python
        _embed_instance = Llama(
            model_path=str(model_path),
            embedding=True,
            verbose=False
        )
        logger.info("Embedding model loaded successfully.")
    return _embed_instance

def get_embedding(text_to_embed: str) -> list[float]:
    """
    Generate an embedding vector for the given text using nomic-embed-text via llama-cpp-python.
    """
    try:
        model = get_embed_model()
        # nomic-embed-text requires specific task prefix instruction for search query/document.
        # RAG searches generally prefix query text with "search_query: "
        if not text_to_embed.startswith("search_query:") and not text_to_embed.startswith("search_document:"):
            text_to_embed = f"search_query: {text_to_embed}"
            
        response = model.create_embedding(text_to_embed)
        return response["data"][0]["embedding"]
    except Exception as e:
        logger.error(f"Local embedding generation failed: {str(e)}")
        raise e
