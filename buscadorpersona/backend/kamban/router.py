from fastapi import APIRouter, HTTPException, Query, Path, Body
from .models import *
import mysql.connector
import requests
from db.conexion_mysql import obtener_conexion
import os

router = APIRouter()

# Función para obtener token de autenticación en Teleprom
def obtener_token_teleprom():
    url = "https://mayten.cloud/auth"
    payload = {
        "username": "asencio.uy@gmail.com",
        "password": "Ma260512!!bolso"
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get("token")
    else:
        raise HTTPException(status_code=500, detail="Error al autenticar con Teleprom")

# Función para enviar emails a Teleprom
def enviar_emails_teleprom(empresas, campana_id, token):
    url = "https://mayten.cloud/api/Mensajes/Email"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    mensajes = []
    for emp in empresas:
        if not emp["email"]:
            continue
        mensajes.append({
            "nombre": emp["nombre_empresa"],
            "apellido": "",
            "email": emp["email"],
            "datos": [
                emp.get("departamento", ""),
                emp.get("actividad_economica", ""),
                emp.get("pagina_web", "")
            ]
        })

    if not mensajes:
        return 0

    response = requests.post(url, headers=headers, json={
        "CampanaId": campana_id,
        "mensajes": mensajes
    })

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error al enviar emails a Teleprom")

    return len(mensajes)

# Función para registrar las empresas en la tabla de estado Kanban
def registrar_en_kanban(empresas, responsable):
    conn = obtener_conexion("BUSQUEDADATOS")
    cursor = conn.cursor()
    for emp in empresas:
        if not emp["id"]:
            continue
        cursor.execute("""
            INSERT INTO kanban_estado_empresa (empresa_id, estado, usuario_responsable)
            VALUES (%s, 'email_enviado', %s)
        """, (emp["id"], responsable))
    conn.commit()
    cursor.close()
    conn.close()

@router.post("/enviar-emails")
def enviar_emails_y_registrar(filtro: FiltroEnvio):
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)
    parametros = filtro.empresas_ids

    # Construcción dinámica del query con fechas opcionales
    # query = """
    #     SELECT * FROM bdempresasuruguay
    #     WHERE departamento LIKE %s
    #     AND actividad_economica LIKE %s
    #     AND email IS NOT NULL AND email <> ''
    # """
    # parametros = [f"%{filtro.departamento}%", f"%{filtro.actividad_economica}%"]

    # if filtro.fecha_desde:
    #     query += " AND fecha_creacion >= %s"
    #     parametros.append(filtro.fecha_desde)

    # if filtro.fecha_hasta:
    #     query += " AND fecha_creacion <= %s"
    #     parametros.append(filtro.fecha_hasta)
    placeholders = ','.join(['%s'] * len(parametros))
    query = f"SELECT * FROM bdempresasuruguay WHERE id IN ({placeholders})"
    
    cursor.execute(query, parametros)
    empresas = cursor.fetchall()

    query = "SELECT * FROM sistema_seguros.usuarios WHERE username = %s"
    cursor.execute(query, (filtro.responsable,))
    responsable = cursor.fetchone()
    cursor.close()
    conn.close()

    if not empresas:
        raise HTTPException(status_code=404, detail="No se encontraron empresas para enviar")
    if not responsable:
        raise HTTPException(status_code=404, detail="No se encontró el usuario")
    

    # token = obtener_token_teleprom()
    # cantidad_enviados = enviar_emails_teleprom(empresas, filtro.campana_id, token)
    cantidad_enviados = len(parametros)
    # print(cantidad_enviados)
    registrar_en_kanban(empresas, responsable["username"])

    return {
        "status": "ok",
        "mensaje": f"Se enviaron {cantidad_enviados} emails y se registraron en el kanban.",
        "empresas": [e["nombre_empresa"] for e in empresas if e.get("email")]
    }

@router.get("/listar")
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

@router.put("/update/{kanban_id}")
async def actualizar_kanban(
    mov: MovimientoKanban = Body(...),
    kanban_id: int = Path(..., gt=0),
):
    if mov.estado and mov.estado not in ESTADOS_VALIDOS:
        raise HTTPException(status_code=400, detail="Estado no válido.")

    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)

    # Verificamos que el kanban exista
    cursor.execute("SELECT * FROM kanban_estado_empresa WHERE id = %s", (kanban_id,))
    existente = cursor.fetchone()

    if not existente:
        raise HTTPException(status_code=404, detail="Registro de kanban no encontrado.")

    updates = []
    valores = []

    # Estado
    if mov.estado:
        updates.append("estado = %s")
        valores.append(mov.estado)

    # Comentario: concatenar con el anterior
    if mov.comentario:
        comentario_anterior = existente["comentario"] or ""
        nuevo_comentario = (
            f"{comentario_anterior}|{mov.comentario}" if comentario_anterior else mov.comentario
        )
        updates.append("comentario = %s")
        valores.append(nuevo_comentario)

    # Usuario responsable: verificar existencia
    if mov.usuario_responsable:
        cursor.execute("SELECT id_usuario FROM sistema_seguros.usuarios WHERE username = %s", (mov.usuario_responsable,))
        usuario = cursor.fetchone()
        if not usuario:
            raise HTTPException(status_code=400, detail="El usuario responsable no existe.")
        updates.append("usuario_responsable = %s")
        valores.append(mov.usuario_responsable)

    if not updates:
        raise HTTPException(status_code=400, detail="No se proporcionó información para actualizar.")

    query = f"""
        UPDATE kanban_estado_empresa
        SET {', '.join(updates)}
        WHERE id = %s
    """
    valores.append(kanban_id)

    cursor.execute(query, valores)
    conn.commit()

    cursor.close()
    conn.close()

    return {
        "status": "ok",
        "mensaje": "Kanban actualizado correctamente."
    }