import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from .env
load_dotenv(BASE_DIR / ".env")

class Settings:
    # GGUF Model Configurations
    GEMMA_REPO_ID: str = os.getenv("GEMMA_REPO_ID", "unsloth/gemma-4-E4B-it-GGUF")
    GEMMA_FILENAME: str = os.getenv("GEMMA_FILENAME", "gemma-4-E4B-it-Q4_K_M.gguf")
    
    EMBED_REPO_ID: str = os.getenv("EMBED_REPO_ID", "nomic-ai/nomic-embed-text-v1.5-GGUF")
    EMBED_FILENAME: str = os.getenv("EMBED_FILENAME", "nomic-embed-text-v1.5.Q4_K_M.gguf")
    
    MODELS_DIR: Path = BASE_DIR / "models"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/gemma_compass.db")
    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    CHAT_CONTEXT_LIMIT: int = int(os.getenv("CHAT_CONTEXT_LIMIT", "2"))
    CHAT_HISTORY_LIMIT: int = int(os.getenv("CHAT_HISTORY_LIMIT", "4"))

settings = Settings()

# Ensure required directories exist
settings.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
