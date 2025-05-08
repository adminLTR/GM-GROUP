from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from db.conexion_localizador import obtener_conexion_busquedadatos

router = APIRouter()

class FiltroEmpresa(BaseModel):
    actividad: Optional[str] = None
    departamento: Optional[str] = None

@router.post("/kanban/filtrar-empresas")
def filtrar_empresas(filtros: FiltroEmpresa):
    conn = obtener_conexion_busquedadatos()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id, nombre_empresa, email, telefono, actividad_economica, departamento FROM bdempresasuruguay WHERE 1=1"
    params = []

    if filtros.actividad:
        query += " AND actividad_economica LIKE %s"
        params.append(f"%{filtros.actividad}%")
    if filtros.departamento:
        query += " AND departamento LIKE %s"
        params.append(f"%{filtros.departamento}%")

    cursor.execute(query, params)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()

    return {"empresas": resultados}
# ruta para agregar tablero #

class AgregarKanban(BaseModel):
    empresa_id: int
    usuario_responsable: str

@router.post("/kanban/agregar")
def agregar_empresa_kanban(data: AgregarKanban):
    conn = obtener_conexion_busquedadatos()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO kanban_estado_empresa (empresa_id, estado, usuario_responsable)
        VALUES (%s, 'email_enviado', %s)
    """, (data.empresa_id, data.usuario_responsable))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "Empresa agregada al tablero Kanban"}
# ruta cambiar estado de empresa #

class CambiarEstado(BaseModel):
    id: int  # ID de kanban_estado_empresa
    nuevo_estado: str

@router.post("/kanban/cambiar-estado")
def cambiar_estado_empresa(data: CambiarEstado):
    conn = obtener_conexion_busquedadatos()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE kanban_estado_empresa SET estado = %s WHERE id = %s
    """, (data.nuevo_estado, data.id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "Estado actualizado correctamente"}
# ruta para agregar comentario#

class ComentarioKanban(BaseModel):
    id: int
    comentario: str

@router.post("/kanban/comentar")
def agregar_comentario(data: ComentarioKanban):
    conn = obtener_conexion_busquedadatos()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE kanban_estado_empresa SET comentario = %s WHERE id = %s
    """, (data.comentario, data.id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"msg": "Comentario guardado correctamente"}
# ruta para ontener empresas agrupadas por estado #

@router.get("/kanban/estados")
def obtener_tablero_kanban():
    conn = obtener_conexion_busquedadatos()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT k.id, k.estado, k.usuario_responsable, k.comentario, e.nombre_empresa, e.email
        FROM kanban_estado_empresa k
        JOIN bdempresasuruguay e ON k.empresa_id = e.id
        ORDER BY k.fecha_creacion DESC
    """)
    filas = cursor.fetchall()
    cursor.close()
    conn.close()

    resultado = {}
    for fila in filas:
        estado = fila["estado"]
        if estado not in resultado:
            resultado[estado] = []
        resultado[estado].append(fila)

    return resultado
