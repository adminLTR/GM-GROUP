from fastapi import APIRouter, HTTPException
from fastapi import Query
from typing import Optional
from db.conexion_mysql import obtener_conexion
import os

from .models import *

router = APIRouter()

@router.get("/departamentos")
async def get_departamentos():
    conn = obtener_conexion(os.getenv("DB_SISTEMA_NAME"))
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_departamento, nombre_departamento FROM departamentos")
    departamentos = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"departamentos": departamentos}

@router.get("/actividades")
async def get_departamentos():
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nombre FROM actividad_economica")
    actividades = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"actividades": actividades}

@router.get("/filtrar")
async def filtrar_empresas(
    departamentos: Optional[str] = Query(None),
    actividades: Optional[str] = Query(None),
    nombre_empresa: Optional[str] = Query(None),
    fecha_desde: Optional[str] = Query(None),
    fecha_hasta: Optional[str] = Query(None)
):
    conexion = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conexion.cursor(dictionary=True)

    query = "SELECT * FROM bdempresasuruguay WHERE 1=1"
    valores = []

    # Filtro por departamentos (varios)
    if departamentos:
        departamentos_lista = departamentos.split("|")
        placeholders = ','.join(['%s'] * len(departamentos_lista))
        query += f" AND departamento IN ({placeholders})"
        valores.extend(departamentos_lista)

    # Filtro por actividades económicas (varios)
    if actividades:
        actividades_lista = actividades.split("|")
        placeholders = ','.join(['%s'] * len(actividades_lista))
        query += f" AND actividad_economica IN ({placeholders})"
        valores.extend(actividades_lista)

    # Filtro por nombre de empresa
    if nombre_empresa:
        query += " AND nombre_empresa LIKE %s"
        valores.append(f"%{nombre_empresa}%")

    # Filtro por fechas
    if fecha_desde:
        query += " AND fecha_creacion >= %s"
        valores.append(fecha_desde)

    if fecha_hasta:
        query += " AND fecha_creacion <= %s"
        valores.append(fecha_hasta)

    # Ejecutar consulta
    cursor.execute(query, valores)
    empresas = cursor.fetchall()
    cursor.close()
    conexion.close()

    return {"empresas": empresas}

@router.post("/agregar")
async def agregar_empresa(empresa: EmpresaCreate):
    conexion = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conexion.cursor()

    try:
        query = """
            INSERT INTO bdempresasuruguay 
            (nombre_empresa, direccion, departamento, localidad, email, telefono, pagina_web, actividad_economica)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        valores = (
            empresa.nombre_empresa,
            empresa.direccion,
            empresa.departamento,
            empresa.departamento,
            empresa.email,
            empresa.telefono,
            empresa.pagina_web,
            empresa.actividad_economica,
        )
        cursor.execute(query, valores)
        conexion.commit()

        return {"mensaje": "Empresa agregada correctamente"}

    except Exception as e:
        conexion.rollback()
        raise HTTPException(status_code=500, detail=f"Error al insertar empresa: {str(e)}")

    finally:
        cursor.close()
        conexion.close()