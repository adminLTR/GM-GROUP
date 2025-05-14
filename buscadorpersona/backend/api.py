from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi import Query
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from fuentes.buscar_coincidencias import buscar_coincidencias
from resultados.guardar_resultados import guardar_resultado_busqueda
from fuentes.validaciones import validar_cedula_uruguaya, validar_rut_uruguayo
from fuentes.busqueda_google import buscar_en_google
from resultados.guardar_google import guardar_resultados_google
from db.conexion_mysql import obtener_conexion
from utils.utils import verificar_password, crear_token_acceso
from datetime import datetime
from dotenv import load_dotenv
import os
import mysql.connector
from mysql.connector import Error
from kamban.routes.enviar_emails_kanban import router as email_router
from kamban.routes.listar import router as listar_router
from kamban.routes.mover import router as mover_router
from pydantic import BaseModel

# Cargar las variables del archivo .env
load_dotenv()
app = FastAPI()

# Habilitar CORS para el frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en producción, restringir esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginInput(BaseModel):
    username: str
    password: str

def obtener_usuario_por_username(username: str):
    try:
        conn = obtener_conexion(os.getenv("DB_SISTEMA_NAME"))
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        return user
    except Error as e:
        print("Error al conectar a MySQL:", e)
        return None

@app.post("/login")
def login(login_input: LoginInput):
    usuario = obtener_usuario_por_username(login_input.username)
    if not usuario or not verificar_password(login_input.password, usuario["password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = crear_token_acceso({"sub": usuario["username"]})
    return {"access_token": token, "token_type": "bearer", "superuser":usuario["es_superuser"]}

@app.get("/get_users")
def get_users():
    conn = obtener_conexion(os.getenv("DB_SISTEMA_NAME"))
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_usuario, username FROM usuarios")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return {'users': users}

@app.post("/buscar")
async def buscar(request: Request):
    data = await request.json()

    nombre = data.get("nombre", "").strip()
    cedula = data.get("cedula", "").strip()
    telefono = data.get("telefono", "").strip()
    direccion = data.get("direccion", "").strip()
    fecha_nacimiento = data.get("fecha_nacimiento", "").strip()
    pais = data.get("pais", "").strip()
    departamento = data.get("departamento", "").strip()
    ciudad = data.get("ciudad", "").strip()
    tipo_persona = data.get("tipo_persona", "Física")

    # Validar fecha
    fecha_nac = None
    try:
        if fecha_nacimiento:
            fecha_nac = datetime.strptime(fecha_nacimiento, "%Y-%m-%d").date()
    except Exception:
        fecha_nac = None

    # Validar documento (sólo si es de Uruguay)
    if pais.lower() == "uruguay" and cedula:
        cedula_limpia = cedula.replace(".", "").replace("-", "")
        if len(cedula_limpia) <= 8:
            tipo_persona = "Física"
            if not validar_cedula_uruguaya(cedula_limpia):
                cedula = ""
        else:
            tipo_persona = "Jurídica"
            if not validar_rut_uruguayo(cedula_limpia):
                cedula = ""

    # Buscar coincidencias
    resultados = buscar_coincidencias(nombre, telefono or None, direccion or None, departamento or None, cedula or None)

    # Guardar búsqueda
    guardar_resultado_busqueda(
        nombre_ingresado=nombre,
        cedula=cedula or None,
        telefono=telefono or None,
        direccion=direccion or None,
        fecha_nacimiento=fecha_nac,
        pais=pais or None,
        departamento=departamento or None,
        ciudad=ciudad or None,
        tipo_persona=tipo_persona,
        coincidencias=resultados
    )

    # Obtener ID de búsqueda recién guardada
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(id) FROM busquedas")
    id_busqueda = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    # Buscar en Google
    resultados_google = []
    posibles_consultas = [
        (f"{nombre}", "nombre") if nombre else None,
        (f"{nombre} {cedula}", "nombre + cedula") if nombre and cedula else None,
        (f"{telefono}", "telefono") if telefono else None,
        (f"{nombre} {ciudad or ''} {pais or ''}".strip(), "nombre + lugar") if nombre and (ciudad or pais) else None,
        (f"{direccion} {ciudad or ''} {pais or ''}".strip(), "direccion + lugar") if direccion and (ciudad or pais) else None
    ]

    for consulta, etiqueta in filter(None, posibles_consultas):
        encontrados = buscar_en_google(consulta)
        if encontrados:
            guardar_resultados_google(id_busqueda, consulta, encontrados, etiqueta)
            resultados_google.extend(encontrados)

    resultados_google = list(set(resultados_google))

    return {
        "resultados": resultados,
        "google": resultados_google[:10]
    }

@app.get("/departamentos")
async def get_departamentos():
    conn = obtener_conexion(os.getenv("DB_SISTEMA_NAME"))
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_departamento, nombre_departamento FROM departamentos")
    departamentos = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"departamentos": departamentos}

@app.get("/actividades")
async def get_departamentos():
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nombre FROM actividad_economica")
    actividades = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"actividades": actividades}

@app.get("/empresas/filtrar")
def filtrar_empresas(
    departamento: Optional[str] = Query(None),
    actividad_economica: Optional[str] = Query(None),
    nombre_empresa: Optional[str] = Query(None),
    fecha_desde: Optional[str] = Query(None),
    fecha_hasta: Optional[str] = Query(None)
):
    try:
        conexion = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
        cursor = conexion.cursor(dictionary=True)

        query = "SELECT * FROM bdempresasuruguay WHERE 1=1"
        valores = []

        if departamento:
            query += " AND departamento = %s"
            valores.append(departamento)
        
        if actividad_economica:
            query += " AND actividad_economica = %s"
            valores.append(actividad_economica)

        if nombre_empresa:
            query += " AND nombre_empresa LIKE %s"
            valores.append(f"%{nombre_empresa}%")

        if fecha_desde:
            query += " AND fecha_creacion >= %s"
            valores.append(fecha_desde)

        if fecha_hasta:
            query += " AND fecha_creacion <= %s"
            valores.append(fecha_hasta)

        cursor.execute(query, valores)
        empresas = cursor.fetchall()
        cursor.close()
        conexion.close()

        return JSONResponse(content={"empresas": empresas})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
app.include_router(email_router)
app.include_router(listar_router)
app.include_router(mover_router)