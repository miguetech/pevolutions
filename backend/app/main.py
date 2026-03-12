from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings

# Importar módulos
from .modules.auth import router as auth_router
from .modules.players import router as players_router
from .modules.account import router as account_router
from .modules.events import router as events_router
from .modules.guilds import router as guilds_router
from .modules.shop import router as shop_router
from .modules.server import router as server_router

app = FastAPI(
    title="PEvolutions API",
    description="Backend API for PEvolutions Pokemon Game - Modular Monolith",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:4321"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers de módulos
app.include_router(auth_router)
app.include_router(players_router)
app.include_router(account_router)
app.include_router(events_router)
app.include_router(guilds_router)
app.include_router(shop_router)
app.include_router(server_router)

@app.get("/")
def root():
    return {"message": "PEvolutions API is running", "version": "2.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
