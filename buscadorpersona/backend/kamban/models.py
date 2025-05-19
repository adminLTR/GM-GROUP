from pydantic import BaseModel
from typing import Optional
from datetime import date

# Modelo para los datos que llegan del frontend
class FiltroEnvio(BaseModel):
    departamento: str
    actividad_economica: str
    campana_id: int
    empresas_ids: list
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    responsable: str