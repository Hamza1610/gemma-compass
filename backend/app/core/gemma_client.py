import logging
from pathlib import Path
from huggingface_hub import hf_hub_download
from llama_cpp import Llama
from app.core.config import settings

logger = logging.getLogger(__name__)

# Singleton LLM instance
_llm_instance = None

def get_llm() -> Llama:
    """
    Thread-safe lazy initialization of the local Gemma 4 E4B model.
    Checks if the model file exists, otherwise raising a clear instruction error.
    """
    global _llm_instance
    if _llm_instance is None:
        logger.info("Initializing Llama model instance for Gemma 4...")
        model_path = Path(settings.MODELS_DIR) / settings.GEMMA_FILENAME
        
        # Raise error if model does not exist
        if not model_path.exists():
            err_msg = (
                f"Model file {settings.GEMMA_FILENAME} not found at {settings.MODELS_DIR}. "
                "Please run './download.sh' in the backend directory to download the required local models."
            )
            logger.error(err_msg)
            raise FileNotFoundError(err_msg)
            
        logger.info(f"Loading GGUF model from {model_path}...")
        # n_ctx=2048 is a reasonable size for local chat and RAG tasks
        # n_gpu_layers=-1 utilizes CUDA/MPS acceleration if compile flags were set, else falls back to CPU
        _llm_instance = Llama(
            model_path=str(model_path),
            n_ctx=2048,
            n_gpu_layers=-1,
            verbose=False
        )
        logger.info("Gemma 4 model loaded successfully.")
    return _llm_instance

def call_gemma(messages: list[dict], response_format_json: bool = False) -> str:
    """
    Calls the local Gemma 4 LLM with a list of messages using llama-cpp-python.
    """
    try:
        llm = get_llm()
        
        # Set response format for JSON constrained generation
        response_format = None
        if response_format_json:
            response_format = {
                "type": "json_object"
            }
            
        logger.info("Generating response from local Gemma 4 model...")
        response = llm.create_chat_completion(
            messages=messages,
            response_format=response_format,
            temperature=0.2
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        logger.error(f"Local Gemma generation failed: {str(e)}")
        raise e
