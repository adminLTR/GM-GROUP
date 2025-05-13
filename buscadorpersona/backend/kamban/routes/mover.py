from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.conexion_mysql import obtener_conexion
import os
router = APIRouter()

# Modelo del cuerpo que recibe la API
class MovimientoKanban(BaseModel):
    empresa_id: int
    nuevo_estado: str
    usuario: str = ""
    comentario: str = ""

# Lista válida de estados permitidos
ESTADOS_VALIDOS = [
    "email_enviado",
    "primer_llamado",
    "reunion",
    "envio_propuesta",
    "seguimiento",
    "envio_contrato",
    "contrato_los_servicios",
    "finalizado"
]

@router.post("/kanban/mover")
def mover_tarjeta_kanban(mov: MovimientoKanban):
    if mov.nuevo_estado not in ESTADOS_VALIDOS:
        raise HTTPException(status_code=400, detail="Estado no válido.")

    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NA,E"))
    cursor = conn.cursor()

    # Verificamos que la empresa esté ya en el tablero
    cursor.execute("SELECT id FROM kanban_estado_empresa WHERE empresa_id = %s", (mov.empresa_id,))
    existente = cursor.fetchone()

    if existente:
        # Actualizamos el estado, comentario y usuario
        cursor.execute("""
            UPDATE kanban_estado_empresa
            SET estado = %s,
                usuario_responsable = %s,
                comentario = %s
            WHERE empresa_id = %s
        """, (mov.nuevo_estado, mov.usuario, mov.comentario, mov.empresa_id))
    else:
        # Insertamos una nueva entrada si no existe
        cursor.execute("""
            INSERT INTO kanban_estado_empresa (empresa_id, estado, usuario_responsable, comentario)
            VALUES (%s, %s, %s, %s)
        """, (mov.empresa_id, mov.nuevo_estado, mov.usuario, mov.comentario))

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "status": "ok",
        "mensaje": f"La empresa fue movida a '{mov.nuevo_estado}'."
    }
