from db.conexion_localizador import obtener_conexion_busqueda

def mostrar_resultados(id_busqueda):
    conn = obtener_conexion_busqueda()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM resultados_google WHERE id_busqueda = %s", (id_busqueda,))
    resultados = cursor.fetchall()

    if not resultados:
        print(f"❌ No hay resultados para la búsqueda ID {id_busqueda}")
    else:
        print(f"\n📋 Resultados de Google para ID {id_busqueda}:")
        for r in resultados:
            print(f"\n🔎 Consulta: {r['consulta_realizada']}")
            print(f"📄 Título: {r['titulo']}")
            print(f"📝 Snippet: {r['snippet']}")
            print(f"🔗 Enlace: {r['enlace']}")

    cursor.close()
    conn.close()

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Uso: python3 ver_resultados_google.py <id_busqueda>")
    else:
        mostrar_resultados(sys.argv[1])
