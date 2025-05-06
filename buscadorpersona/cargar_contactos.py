# cargar_contactos.py

import csv
from db.conexion_localizador import obtener_conexion_busqueda

def cargar_contactos_desde_csv(ruta_archivo):
    conn = obtener_conexion_busqueda()
    cursor = conn.cursor()

    contactos_insertados = 0
    contactos_omitidos = 0

    with open(ruta_archivo, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            nombre_completo = row.get("name", "").strip()
            telefono = row.get("number", "").strip().replace(" ", "")

            if not nombre_completo or not telefono:
                continue
            if nombre_completo in ["-----", ".", "-"] or telefono in ["", "-", "0"]:
                continue

            # Verificar duplicado por teléfono
            cursor.execute("""
                SELECT COUNT(*) FROM contactosinternos
                WHERE telefono = %s
            """, (telefono,))
            existe = cursor.fetchone()[0]

            if existe == 0:
                cursor.execute("""
                    INSERT INTO contactosinternos (nombre_completo, telefono)
                    VALUES (%s, %s)
                """, (nombre_completo, telefono))
                contactos_insertados += 1
            else:
                contactos_omitidos += 1

    conn.commit()
    cursor.close()
    conn.close()

    print(f"✅ Contactos insertados: {contactos_insertados}")
    print(f"⚠️ Contactos duplicados omitidos: {contactos_omitidos}")

if __name__ == "__main__":
    cargar_contactos_desde_csv("/Users/marceloasencio/Documents/buscadorpersona/contacts (4).csv")




