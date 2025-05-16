## FILTRADO Y ENVIAR EMAIL ## COMERCIAL 

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import date
import mysql.connector
import requests
from db.conexion_mysql import obtener_conexion
import os

router = APIRouter()

# Modelo para los datos que llegan del frontend
class FiltroEnvio(BaseModel):
    departamento: str
    actividad_economica: str
    campana_id: int
    empresas_ids: list
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    responsable: str

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

# Endpoint para filtrar empresas, enviar email y agregarlas al kanban
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
