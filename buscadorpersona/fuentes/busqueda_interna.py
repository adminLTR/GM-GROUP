from db.conexion_mysql import obtener_conexion
from fuentes.contacto_interno_mysql import buscar_contacto_interno

def buscar_en_base_personas(nombre_completo, telefono=None, direccion=None):
    conn = obtener_conexion()
    cursor = conn.cursor(dictionary=True)

    apellido_uno, apellido_dos = "", ""
    partes = nombre_completo.strip().split()
    if len(partes) >= 2:
        apellido_uno, apellido_dos = partes[-2].lower(), partes[-1].lower()
    nombre = ' '.join(partes[:-2]) if len(partes) > 2 else ""

    resultados = []

    def agregar_contacto_interno(persona):
        contacto_info = buscar_contacto_interno(
            f"{persona.get('nombre', '')} {persona.get('apellido', '')}",
            persona.get("telefono", "")
        )
        persona.update(contacto_info)
        return persona

    # Coincidencia por teléfono exacto
    if telefono:
        cursor.execute("SELECT * FROM persona WHERE telefono = %s", (telefono,))
        for row in cursor.fetchall():
            resultados.append(agregar_contacto_interno(row))

    # Coincidencia por apellido
    cursor.execute("""
        SELECT * FROM persona 
        WHERE LOWER(apellido) LIKE %s OR LOWER(apellido) LIKE %s
    """, (f"%{apellido_uno}%", f"%{apellido_dos}%"))
    for row in cursor.fetchall():
        resultados.append(agregar_contacto_interno(row))

    cursor.close()
    conn.close()
    return resultados

