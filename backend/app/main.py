from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth

app = FastAPI(
    title="PEvolutions API",
    description="Backend API for PEvolutions Pokemon Game",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:4321"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "PEvolutions API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
