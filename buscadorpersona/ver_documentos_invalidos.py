from db.conexion_localizador import obtener_conexion_busqueda

def listar_documentos_invalidos():
    conn = obtener_conexion_busqueda()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            c.nombre,
            c.apellido,
            c.cedula,
            c.tipo_persona,
            c.tipo_coincidencia,
            c.grado_confianza,
            b.fecha AS fecha_busqueda
        FROM coincidencias c
        JOIN busquedas b ON c.id_busqueda = b.id_busqueda
        WHERE c.documento_valido = 0
        ORDER BY b.fecha DESC
    """)

    resultados = cursor.fetchall()
    conn.close()

    if not resultados:
        print("✅ No hay coincidencias con documentos inválidos.")
        return

    print("\n📋 Coincidencias con documento inválido:\n")
    for r in resultados:
        print(f"🧍 {r['nombre']} {r['apellido']} | 🪪 {r['cedula']} | {r['tipo_persona']} | "
              f"{r['tipo_coincidencia']} ({r['grado_confianza']}) | 🕒 {r['fecha_busqueda']}")


if __name__ == "__main__":
    listar_documentos_invalidos()
