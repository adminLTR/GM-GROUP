from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importá tus routers
from api import enviar_emails_kanban  # Asegurate que esta ruta exista correctamente

app = FastAPI(
    title="Buscador de Empresas y Kanban",
    description="API para filtrar empresas, enviar emails y organizar en tablero kanban",
    version="1.0.0"
)

# Middleware para permitir llamadas desde el frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # podés especificar frontend: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir tus rutas
app.include_router(enviar_emails_kanban.router)

# Si querés una ruta de prueba para chequear si el servidor está activo:
@app.get("/")
def root():
    return {"message": "API activa y funcionando 🚀"}
