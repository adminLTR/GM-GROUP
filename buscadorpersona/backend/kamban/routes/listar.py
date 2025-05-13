from fastapi import APIRouter, HTTPException, Query
from db.conexion_mysql import obtener_conexion
import os

router = APIRouter()

@router.get("/kanban/listar")
def listar_tablero_kanban(username: str = Query(..., description="Nombre de usuario")):
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM sistema_seguros.usuarios WHERE username = %s
    """, (username,))
    
    user = cursor.fetchone()
    if not user:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    query = """
        SELECT
            k.id AS kanban_id,
            k.empresa_id,
            k.estado,
            k.usuario_responsable,
            k.comentario,
            e.nombre_empresa,
            e.email,
            e.telefono,
            e.direccion,
            e.departamento,
            e.localidad,
            e.actividad_economica
        FROM kanban_estado_empresa k
        INNER JOIN bdempresasuruguay e ON k.empresa_id = e.id
    """

    if not user["es_superuser"]:
        query += f" WHERE k.usuario_responsable = '{user['username']}'"
    # Obtenemos todas las entradas del tablero con datos de empresa
    cursor.execute(query)

    filas = cursor.fetchall()
    cursor.close()
    conn.close()

    # Agrupamos por estado
    tablero = {}
    for fila in filas:
        estado = fila["estado"]
        if estado not in tablero:
            tablero[estado] = []
        tablero[estado].append(fila)

    return {
        "status": "ok",
        "tablero": tablero,
        "es_superuser": user["es_superuser"]
    }
