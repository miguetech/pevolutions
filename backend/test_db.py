#!/usr/bin/env python3
from app.database import engine, SessionLocal
from sqlalchemy import text

def test_connection():
    try:
        # Test engine connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✓ Database connection successful")
            
        # Test session
        db = SessionLocal()
        result = db.execute(text("SELECT DATABASE()"))
        db_name = result.scalar()
        print(f"✓ Connected to database: {db_name}")
        
        # Test tables
        result = db.execute(text("SHOW TABLES"))
        tables = [row[0] for row in result]
        print(f"✓ Tables found: {tables}")
        
        db.close()
        print("\n✓ All database checks passed!")
        
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_connection()
