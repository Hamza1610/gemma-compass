import os
from pathlib import Path
from dotenv import load_dotenv

# Resolve paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from .env
load_dotenv(BASE_DIR / ".env")

class Settings:
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434/v1")
    MODEL_TAG: str = os.getenv("MODEL_TAG", "gemma4:e2b")  # Configurable default, user Local model
    EMBEDDING_MODEL_TAG: str = os.getenv("EMBEDDING_MODEL_TAG", "nomic-embed-text")
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/gemma_compass.db")
    UPLOADS_DIR: Path = BASE_DIR / "uploads"
    CHAT_CONTEXT_LIMIT: int = int(os.getenv("CHAT_CONTEXT_LIMIT", "2"))
    CHAT_HISTORY_LIMIT: int = int(os.getenv("CHAT_HISTORY_LIMIT", "4"))

settings = Settings()

# Ensure uploads directory exists
settings.UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
