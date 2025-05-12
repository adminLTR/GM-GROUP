import unicodedata
import re
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os

def normalizar_texto(texto):
    if not texto:
        return ""
    texto = texto.lower().strip()
    texto = unicodedata.normalize("NFD", texto)
    texto = ''.join(c for c in texto if unicodedata.category(c) != 'Mn')
    return texto

def limpiar_telefono(telefono):
    if not telefono:
        return ""
    telefono = telefono.strip().replace(" ", "").replace("-", "")
    return telefono[-8:] if len(telefono) >= 8 else telefono

def calcular_confianza(tipo):
    if tipo == "coincidencia_telefono":
        return "ALTA"
    elif tipo == "coincidencia_apellidos_exacta":
        return "ALTA"
    elif tipo == "coincidencia_direccion":
        return "MEDIA"
    elif tipo == "coincidencia_apellido_individual":
        return "BAJA"
    else:
        return "BAJA"

def extraer_calle_y_numero(direccion):
    match = re.search(r'(.+?)\s+(\d+)', direccion)
    if match:
        calle = match.group(1).strip()
        numero = int(match.group(2))
        return calle, numero
    return direccion.strip(), None

def construir_regexp_numero(numero):
    if numero is None:
        return None
    rango = [numero - 5, numero + 5]
    return f"\\b{rango[0]}\\b|\\b{numero}\\b|\\b{rango[1]}\\b"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_password(password_plano, password_hash):
    return pwd_context.verify(password_plano, password_hash)

def crear_token_acceso(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        to_encode["exp"] = datetime.now() + expires_delta
    else:
        to_encode["exp"] = datetime.now() + timedelta(minutes=15)
    return jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))