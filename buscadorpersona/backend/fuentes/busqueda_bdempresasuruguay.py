from db.conexion_bdempresasuruguay import obtener_conexion_bdempresasuruguay

def buscar_en_bdempresasuruguay(nombre, telefono=None, direccion=None):
    conn = obtener_conexion_bdempresasuruguay()
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
