from sqlmodel import SQLModel, create_engine, Session
import sqlite_vec
from sqlalchemy import event, text
from app.core.config import settings

# Create engine
# connect_args={"check_same_thread": False} is required for SQLite in FastAPI
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Load sqlite-vec extension on connect event
@event.listens_for(engine, "connect")
def receive_connect(dbapi_connection, connection_record):
    dbapi_connection.enable_load_extension(True)
    sqlite_vec.load(dbapi_connection)
    dbapi_connection.enable_load_extension(False)

def init_db():
    # Create all SQLModel tables
    SQLModel.metadata.create_all(engine)
    
    # Create virtual table for vector embeddings if not exists
    # Keyed by chunk_id, mapping to the Chunk table's primary key
    with engine.connect() as conn:
        conn.execute(text(
            "CREATE VIRTUAL TABLE IF NOT EXISTS chunk_vectors USING vec0("
            "  chunk_id TEXT PRIMARY KEY,"
            "  embedding float32[768]"
            ");"
        ))
        conn.commit()

def get_db():
    with Session(engine) as session:
        yield session
