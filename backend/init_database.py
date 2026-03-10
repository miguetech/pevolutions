#!/usr/bin/env python3
"""
Script para inicializar la base de datos con datos de ejemplo
"""
import sys
import time
from app.database import engine, SessionLocal
from app.models import Base, Event

def init_db():
    print("🔧 Inicializando base de datos...")
    
    # Crear tablas que no existen
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas verificadas")
    
    # Insertar eventos de ejemplo si no existen
    db = SessionLocal()
    try:
        event_count = db.query(Event).count()
        if event_count == 0:
            print("📅 Insertando eventos de ejemplo...")
            events = [
                Event(
                    title="Crystal League Tournament",
                    description="The ultimate PvP tournament for trainers level 50+",
                    date="Jan 20, 2026",
                    tag="Tournament",
                    created_at=int(time.time())
                ),
                Event(
                    title="Legendary Bird Sighting",
                    description="Articuno has been spotted near the Frozen Peaks",
                    date="Jan 15, 2026",
                    tag="Contest",
                    created_at=int(time.time())
                ),
                Event(
                    title="Economy Rebalance Patch",
                    description="Technical update focusing on market stability",
                    date="Jan 10, 2026",
                    tag="Update",
                    created_at=int(time.time())
                )
            ]
            db.add_all(events)
            db.commit()
            print(f"✅ {len(events)} eventos insertados")
        else:
            print(f"ℹ️  Ya existen {event_count} eventos")
        
        print("\n✅ Base de datos lista!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
