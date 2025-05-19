from fastapi import APIRouter, HTTPException
from db.conexion_mysql import obtener_conexion
from .models import *
from mysql.connector import Error
import os
from utils.utils import *
import bcrypt

router = APIRouter()

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


@router.get("/all")
def get_users():
    conn = obtener_conexion(os.getenv("DB_SISTEMA_NAME"))
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_usuario, username FROM usuarios")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return {'users': users}

@router.post("/login")
def login(login_input: LoginInput):
    usuario = obtener_usuario_por_username(login_input.username)
    if not usuario or not verificar_password(login_input.password, usuario["password"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = crear_token_acceso({"sub": usuario["username"]})
    return {"access_token": token, "token_type": "bearer", "superuser":usuario["es_superuser"]}


@router.post("/crear")
def crear_usuario(usuario: Usuario):
    try:
        conn = obtener_conexion(os.getenv("DB_SISTEMA_NAME"))
        cursor = conn.cursor()
        hashed_password = bcrypt.hashpw(usuario.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print(hashed_password)
        
        cursor.execute("""
            INSERT INTO usuarios (username, password, nombre_completo, email, telefono, es_superuser, estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            usuario.username,
            hashed_password,
            usuario.nombres,
            usuario.email,
            usuario.telefono,
            usuario.superuser,
            'activo'
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {"status": "ok", "message": "Usuario creado correctamente"}
    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail=str(e))
