from pydantic import BaseModel, EmailStr
from typing import Optional

class EmpresaCreate(BaseModel):
    nombre_empresa: str
    departamento: str
    direccion: str
    actividad_economica: str
    email: Optional[EmailStr] = None
    telefono: Optional[str] = None
    pagina_web: Optional[str] = None