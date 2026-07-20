import sys
from pathlib import Path

# Add project root to path
sys.path.append(str(Path(__file__).resolve().parent))
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.db import init_db, engine
from sqlalchemy import text

def test_db_setup():
    print("Initializing Database...")
    init_db()
    print("Database Initialized.")

    with engine.connect() as conn:
        # Check vec version
        result = conn.execute(text("SELECT vec_version();")).fetchone()
        print(f"sqlite-vec version: {result[0] if result else 'Not found'}")
        
        # Verify virtual table exists
        tables = conn.execute(text(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='chunk_vectors';"
        )).fetchall()
        print(f"Tables in master: {tables}")
        
        if tables:
            print("Virtual table chunk_vectors successfully verified!")
        else:
            print("Error: chunk_vectors virtual table not found.")

if __name__ == "__main__":
    test_db_setup()
