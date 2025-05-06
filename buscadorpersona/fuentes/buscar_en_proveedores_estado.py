import re
from db.conexion_proveedores_estado import obtener_conexion_busquedadatos

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

def buscar_en_proveedores_estado(nombre=None, telefono=None, direccion=None, departamento=None, rut=None):
    conn = obtener_conexion_busquedadatos()
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

