#!/bin/bash
# Script para ejecutar el servidor FastAPI

cd "$(dirname "$0")"

# Activar entorno virtual
source venv/bin/activate

# Ejecutar servidor
echo "🚀 Iniciando servidor FastAPI en http://localhost:8000"
echo "📚 Documentación disponible en http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
