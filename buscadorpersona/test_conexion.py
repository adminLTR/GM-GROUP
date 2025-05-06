from db.conexion_mysql import obtener_conexion

def listar_tablas():
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")
    tablas = cursor.fetchall()
    print("📦 Tablas encontradas en 'sistema_seguros':")
    for t in tablas:
        print(f" - {t[0]}")
    cursor.close()
    conn.close()

if __name__ == "__main__":
    listar_tablas()
