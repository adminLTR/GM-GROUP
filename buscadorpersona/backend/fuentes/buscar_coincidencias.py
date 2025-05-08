import difflib
import os
from db.conexion_mysql import obtener_conexion
from utils.utils import normalizar_texto, limpiar_telefono, extraer_calle_y_numero, construir_regexp_numero

def buscar_en_bdempresasuruguay(nombre, telefono=None, direccion=None):
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM bdempresasuruguay WHERE nombre_empresa LIKE %s"
    params = [f"%{nombre}%"]

    if telefono:
        query += " OR telefono LIKE %s"
        params.append(f"%{telefono}%")

    if direccion:
        query += " OR direccion LIKE %s"
        params.append(f"%{direccion}%")

    cursor.execute(query, params)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return resultados

def buscar_en_proveedores_estado(nombre=None, telefono=None, direccion=None, departamento=None, rut=None):
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
    cursor = conn.cursor(dictionary=True)
    resultados = []

    # 1. Buscar por RUT exacto
    if rut:
        cursor.execute("SELECT *, 'coincide por RUT' AS motivo FROM provedoresdelestadouy WHERE rut = %s", (rut,))
        resultados = cursor.fetchall()
        if resultados:
            cursor.close()
            conn.close()
            return resultados

    # 2. Buscar por nombre
    if nombre:
        cursor.execute("SELECT *, 'coincide por nombre' AS motivo FROM provedoresdelestadouy WHERE denominacion_social LIKE %s LIMIT 10", (f"%{nombre}%",))
        resultados = cursor.fetchall()
        if resultados:
            cursor.close()
            conn.close()
            return resultados

    # 3. Buscar por teléfono
    if telefono:
        cursor.execute("SELECT *, 'coincide por teléfono' AS motivo FROM provedoresdelestadouy WHERE telefono LIKE %s LIMIT 10", (f"%{telefono}%",))
        resultados = cursor.fetchall()
        if resultados:
            cursor.close()
            conn.close()
            return resultados

    # 4. Buscar por dirección con departamento
    if direccion and departamento:
        calle, numero = extraer_calle_y_numero(direccion)
        regexp = construir_regexp_numero(numero)
        if numero and regexp:
            cursor.execute("""
                SELECT *, 'coincide por dirección y departamento' AS motivo 
                FROM provedoresdelestadouy 
                WHERE domicilio LIKE %s AND departamento LIKE %s AND domicilio REGEXP %s
                LIMIT 10
            """, (f"%{calle}%", f"%{departamento}%", regexp))
        else:
            cursor.execute("""
                SELECT *, 'coincide por dirección y departamento (sin número)' AS motivo 
                FROM provedoresdelestadouy 
                WHERE domicilio LIKE %s AND departamento LIKE %s
                LIMIT 10
            """, (f"%{direccion}%", f"%{departamento}%",))
        resultados = cursor.fetchall()
        if resultados:
            cursor.close()
            conn.close()
            return resultados

    # 5. Buscar por dirección sola (sin departamento), máx 10 resultados
    if direccion and not departamento:
        calle, numero = extraer_calle_y_numero(direccion)
        regexp = construir_regexp_numero(numero)
        if numero and regexp:
            cursor.execute("""
                SELECT *, 'coincide por dirección sola' AS motivo 
                FROM provedoresdelestadouy 
                WHERE domicilio LIKE %s AND domicilio REGEXP %s
                LIMIT 10
            """, (f"%{calle}%", regexp))
        else:
            cursor.execute("""
                SELECT *, 'coincide por dirección sola (sin número)' AS motivo 
                FROM provedoresdelestadouy 
                WHERE domicilio LIKE %s
                LIMIT 10
            """, (f"%{direccion}%",))
        resultados = cursor.fetchall()
        if resultados:
            cursor.close()
            conn.close()
            return resultados

    cursor.close()
    conn.close()
    return resultados

def buscar_contacto_interno(nombre_busqueda, telefono_busqueda):
    conn = obtener_conexion(os.getenv("DB_BUSQUEDA_NAME"))
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

def buscar_en_contactos_internos(nombre_completo, telefono=None):
    contacto_nombre = buscar_contacto_interno(nombre_completo, "")
    contacto_telefono = buscar_contacto_interno("", telefono)

    resultados = []

    # Coincidencia por nombre (aunque no coincida el teléfono)
    if contacto_nombre["contacto_interno"]:
        resultados.append({
            "nombre": contacto_nombre["nombre_contacto_interno"],
            "apellido": "",
            "telefono": contacto_nombre["telefono_contacto_interno"],
            "direccion": "Detectado como contacto GM por nombre",
            "ciudad": "",
            "departamento": "",
            "contacto_interno": True,
            "tipo_contacto_interno": contacto_nombre["tipo_contacto_interno"],
            "nombre_contacto_interno": contacto_nombre["nombre_contacto_interno"],
            "telefono_contacto_interno": contacto_nombre["telefono_contacto_interno"]
        })

    # Coincidencia por teléfono (si es otro contacto, lo mostramos también)
    if contacto_telefono["contacto_interno"]:
        # Evitamos duplicar si es la misma persona que coincidió por nombre
        mismo_contacto = (
            contacto_telefono["nombre_contacto_interno"] == contacto_nombre["nombre_contacto_interno"] and
            contacto_telefono["telefono_contacto_interno"] == contacto_nombre["telefono_contacto_interno"]
        )
        if not mismo_contacto:
            resultados.append({
                "nombre": contacto_telefono["nombre_contacto_interno"],
                "apellido": "",
                "telefono": contacto_telefono["telefono_contacto_interno"],
                "direccion": "Propietario del teléfono ingresado",
                "ciudad": "",
                "departamento": "",
                "contacto_interno": True,
                "tipo_contacto_interno": "TELEFONO",
                "nombre_contacto_interno": contacto_telefono["nombre_contacto_interno"],
                "telefono_contacto_interno": contacto_telefono["telefono_contacto_interno"]
            })

    return resultados

def buscar_coincidencias(nombre_completo, telefono=None, direccion=None, departamento=None, rut=None):
    resultados = {}

    # 🔎 Fuente 1: Base de personas (seguros)
   # resultado_persona = buscar_en_base_personas(nombre_completo, telefono, direccion)
   # if resultado_persona:
      #  resultados["persona"] = resultado_persona #

    # 🔎 Fuente 2: Contactos internos GM
    resultado_contacto = buscar_en_contactos_internos(nombre_completo, telefono)
    if resultado_contacto:
        resultados["contacto_interno"] = resultado_contacto

    # 🔎 Fuente 3: Empresas Uruguay
    resultado_empresas = buscar_en_bdempresasuruguay(nombre_completo, telefono, direccion)
    if resultado_empresas:
        resultados["empresas_uruguay"] = resultado_empresas

    # 🔎 Fuente 4: Proveedores del Estado (nuevo)
    resultado_proveedores = buscar_en_proveedores_estado(
        nombre=nombre_completo,
        telefono=telefono,
        direccion=direccion,
        departamento=departamento,
        rut=rut
    )
    if resultado_proveedores:
        resultados["proveedores_estado"] = resultado_proveedores

    return resultados

