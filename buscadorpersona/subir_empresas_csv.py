import pandas as pd
import mysql.connector
import os

# Ruta real del archivo CSV
archivo_csv = "/Users/marceloasencio/Documents/buscadorpersona/bdempresasuruguay.csv"

# Validar si el archivo existe
if not os.path.exists(archivo_csv):
    print(f"❌ El archivo no existe en la ruta: {archivo_csv}")
    exit()

# Cargar CSV
try:
    df = pd.read_csv(archivo_csv, sep=";", encoding="utf-8", engine="python", on_bad_lines="skip")
except Exception as e:
    print(f"❌ Error al leer el archivo CSV: {e}")
    exit()

# Renombrar columnas
df.columns = [
    "nombre_empresa", "direccion", "departamento", "localidad",
    "email", "telefono", "pagina_web", "actividad_economica"
]

# Reemplazar NaN por valores por defecto
for col in df.columns:
    if df[col].dtype in ["float64", "int64"]:
        df[col] = df[col].fillna(0)
    else:
        df[col] = df[col].fillna("sin datos")

# Conexión MySQL
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Ma260512!!",
        database="busquedadatos"
    )
    cursor = conn.cursor()
except Exception as e:
    print(f"❌ Error al conectar con MySQL: {e}")
    exit()

# Contadores
insertados = 0
saltados = 0

# Insertar
for _, row in df.iterrows():
    nombre_empresa = row["nombre_empresa"]
    try:
        cursor.execute("SELECT COUNT(*) FROM bdempresasuruguay WHERE nombre_empresa = %s", (nombre_empresa,))
        existe = cursor.fetchone()[0]

        if existe == 0:
            cursor.execute("""
                INSERT INTO bdempresasuruguay (
                    nombre_empresa, direccion, departamento, localidad,
                    email, telefono, pagina_web, actividad_economica
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                row["nombre_empresa"],
                row["direccion"],
                row["departamento"],
                row["localidad"],
                row["email"],
                row["telefono"],
                row["pagina_web"],
                row["actividad_economica"]
            ))
            insertados += 1
        else:
            saltados += 1
    except Exception as e:
        print(f"⚠️ Error al insertar {nombre_empresa}: {e}")
        continue

# Finalizar
conn.commit()
cursor.close()
conn.close()

print("\n✅ Carga finalizada correctamente.")
print(f"➕ Empresas insertadas: {insertados}")
print(f"⛔ Empresas duplicadas saltadas: {saltados}")


