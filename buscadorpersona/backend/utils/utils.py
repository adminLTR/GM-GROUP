import unicodedata
import re

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