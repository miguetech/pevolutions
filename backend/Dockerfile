# ==========================================
# Backend Dockerfile (FastAPI + Python 3.11)
# ==========================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias de sistema mínimas requeridas si fuera necesario
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Dar permisos de ejecución a scripts
RUN chmod +x init_database.py

EXPOSE 8000

# Script de arranque: inicializa BD si no existe y luego inicia uvicorn
CMD ["sh", "-c", "python init_database.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
