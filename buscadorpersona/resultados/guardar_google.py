from db.conexion_localizador import obtener_conexion_busqueda

def guardar_resultados_google(id_busqueda, consulta, resultados, tipo_busqueda):
    conn = obtener_conexion_busqueda()
    cursor = conn.cursor()

    for r in resultados:
        partes = r.split("\n")
        if len(partes) >= 3:
            titulo = partes[0]
            snippet = partes[1]
            enlace = partes[2].replace("🔗 ", "").strip()

            cursor.execute("""
                INSERT INTO resultados_google (id_busqueda, consulta_realizada, tipo_busqueda, titulo, snippet, enlace)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (id_busqueda, consulta, tipo_busqueda, titulo, snippet, enlace))

    conn.commit()
    cursor.close()
    conn.close()
