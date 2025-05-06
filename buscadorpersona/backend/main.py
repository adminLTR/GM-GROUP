# === BACKEND (FastAPI) ===
# Archivo: backend/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# Permitir peticiones desde React (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos
class BusquedaRequest(BaseModel):
    nombre: str
    cedula: str = None
    telefono: str = None
    direccion: str = None
    fecha_nacimiento: str = None
    pais: str
    departamento: str = None
    ciudad: str = None
    tipo_persona: str

@app.post("/buscar")
async def realizar_busqueda(data: BusquedaRequest):
    # Acá llamás a tu lógica real
    print("📥 Recibido:", data.dict())
    # Simulamos resultado:
    resultado = {
        "coincidencias_internas": [
            {"nombre": data.nombre, "telefono": data.telefono, "direccion": data.direccion}
        ],
        "google_resultados": [
            "https://resultado-de-ejemplo.com/1",
            "https://resultado-de-ejemplo.com/2"
        ]
    }
    return {"status": "ok", "resultados": resultado}
