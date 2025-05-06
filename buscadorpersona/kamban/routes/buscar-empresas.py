from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from db.conexion_bdempresasuruguay import obtener_conexion_busquedadatos

router = APIRouter()

class FiltroBusqueda(BaseModel):
    nombre_empresa: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    localidad: Optional[str] = None
    departamento: Optional[str] = None
    actividad_economica: Optional[str] = None

@router.post("/buscar-empresas")
def buscar_empresas(filtro: FiltroBusqueda):
    conn = obtener_conexion_busquedadatos()
    cursor = conn.cursor(dictionary=True)

    condiciones = []
    parametros = []

    if filtro.nombre_empresa:
        condiciones.append("nombre_empresa LIKE %s")
        parametros.append(f"%{filtro.nombre_empresa}%")
    if filtro.email:
        condiciones.append("email LIKE %s")
        parametros.append(f"%{filtro.email}%")
    if filtro.telefono:
        condiciones.append("telefono LIKE %s")
        parametros.append(f"%{filtro.telefono}%")
    if filtro.localidad:
        condiciones.append("localidad LIKE %s")
        parametros.append(f"%{filtro.localidad}%")
    if filtro.departamento:
        condiciones.append("departamento LIKE %s")
        parametros.append(f"%{filtro.departamento}%")
    if filtro.actividad_economica:
        condiciones.append("actividad_economica LIKE %s")
        parametros.append(f"%{filtro.actividad_economica}%")

    if not condiciones:
        raise HTTPException(status_code=400, detail="Debe ingresar al menos un criterio de búsqueda.")

    query = f"""
        SELECT id, nombre_empresa, email, telefono, direccion, localidad, departamento, actividad_economica
        FROM bdempresasuruguay
        WHERE {' AND '.join(condiciones)}
        LIMIT 100
    """

    cursor.execute(query, parametros)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()

    return {"empresas": resultados}
