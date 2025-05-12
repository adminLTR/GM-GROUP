from fastapi import APIRouter, HTTPException
from db.conexion_mysql import obtener_conexion

router = APIRouter()

@router.get("/kanban/listar")
def listar_tablero_kanban():
    conn = obtener_conexion("BUSQUEDADATOS")
    cursor = conn.cursor(dictionary=True)

    # Obtenemos todas las entradas del tablero con datos de empresa
    cursor.execute("""
        SELECT
            k.id AS kanban_id,
            k.empresa_id,
            k.estado,
            k.usuario_responsable,
            k.comentario,
            k.fecha_creacion,
            e.nombre_empresa,
            e.email,
            e.telefono,
            e.direccion,
            e.departamento,
            e.localidad,
            e.actividad_economica
        FROM kanban_estado_empresa k
        JOIN bdempresasuruguay e ON k.empresa_id = e.id
    """)

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
        "tablero": tablero
    }
