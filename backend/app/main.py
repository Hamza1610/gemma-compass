from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.db import init_db
from app.api.sessions import router as sessions_router
from app.api.documents import router as documents_router
from app.api.chat import router as chat_router
from app.api.quiz import router as quiz_router
from app.api.roadmap import router as roadmap_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize the database and load sqlite-vec extension
    logger.info("Initializing SQLite database and virtual tables...")
    try:
        init_db()
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.critical(f"Database initialization failed: {str(e)}")
    yield
    # Shutdown: Clean up resources if needed
    logger.info("Shutting down backend services...")

app = FastAPI(
    title="Gemma Compass API",
    description="Offline bilingual academic tutor backend powered by Gemma.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration to allow Next.js local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend port (e.g. localhost:3000)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount sub-routers
app.include_router(sessions_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(quiz_router)
app.include_router(roadmap_router)

@app.get("/")
def read_root():
    return {"status": "online", "service": "Gemma Compass API"}
