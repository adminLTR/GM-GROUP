import unicodedata
import difflib
from db.conexion_localizador import obtener_conexion_busqueda

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

def buscar_contacto_interno(nombre_busqueda, telefono_busqueda):
    conn = obtener_conexion_busqueda()
    cursor = conn.cursor(dictionary=True)

    resultado = {
        "contacto_interno": False,
        "tipo_contacto_interno": None,
        "nombre_contacto_interno": None,
        "telefono_contacto_interno": None
    }

    nombre_b = normalizar_texto(nombre_busqueda)
    telefono_b = limpiar_telefono(telefono_busqueda)

    cursor.execute("SELECT nombre, telefono FROM contactosinternos")
    contactos = cursor.fetchall()

    for c in contactos:
        nombre_c = normalizar_texto(c["nombre"])
        telefono_c = limpiar_telefono(c["telefono"])

        # Coincidencia exacta por nombre
        if nombre_b == nombre_c:
            resultado.update({
                "contacto_interno": True,
                "tipo_contacto_interno": "EXACTO",
                "nombre_contacto_interno": c["nombre"],
                "telefono_contacto_interno": c["telefono"]
            })
            break

        # Coincidencia parcial por palabras
        palabras = nombre_b.split()
        for palabra in palabras:
            if palabra and palabra in nombre_c:
                resultado.update({
                    "contacto_interno": True,
                    "tipo_contacto_interno": "PARCIAL",
                    "nombre_contacto_interno": c["nombre"],
                    "telefono_contacto_interno": c["telefono"]
                })
                break

        # Coincidencia fuzzy
        similitud = difflib.SequenceMatcher(None, nombre_b, nombre_c).ratio()
        if similitud >= 0.9:
            resultado.update({
                "contacto_interno": True,
                "tipo_contacto_interno": "EXACTO_NORMALIZADO",
                "nombre_contacto_interno": c["nombre"],
                "telefono_contacto_interno": c["telefono"]
            })
        elif similitud >= 0.5:
            resultado.update({
                "contacto_interno": True,
                "tipo_contacto_interno": "SIMILAR_POR_ERROR",
                "nombre_contacto_interno": c["nombre"],
                "telefono_contacto_interno": c["telefono"]
            })

        # Coincidencia exacta por teléfono
        if telefono_b and telefono_b == telefono_c:
            resultado.update({
                "contacto_interno": True,
                "tipo_contacto_interno": "TELEFONO",
                "nombre_contacto_interno": c["nombre"],
                "telefono_contacto_interno": c["telefono"]
            })
            break

    cursor.close()
    conn.close()
    return resultado
