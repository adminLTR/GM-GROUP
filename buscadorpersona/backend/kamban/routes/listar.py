from fastapi import APIRouter, HTTPException
from db.conexion_mysql import obtener_conexion
import os

router = APIRouter()

@router.get("/kanban/listar")
def listar_tablero_kanban():
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)

    # Obtenemos todas las entradas del tablero con datos de empresa
    cursor.execute("""
        SELECT
            k.id AS kanban_id,
            k.empresa_id,
            k.estado,
            u.username AS responsable,
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
        LEFT JOIN sistema_seguros.usuarios u ON k.usuario_responsable = u.id_usuario
    """)

    filas = cursor.fetchall()
    cursor.close()
    conn.close()
    print(filas)

    # Agrupamos por estado
    tablero = {}
    for fila in filas:
        estado = fila["estado"]
        if estado not in tablero:
            tablero[estado] = []
        tablero[estado].append(fila)

    return {
        "status": "ok",
        "tablero": tablero
    }
