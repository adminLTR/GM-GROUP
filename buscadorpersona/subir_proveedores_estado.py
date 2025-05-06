import pandas as pd
import mysql.connector

archivo_csv = "/Users/marceloasencio/Documents/buscadorpersona/provedores_estado_corregido_v2.csv"

# Leer el CSV
df = pd.read_csv(archivo_csv, dtype={"RUT": str, "Codigo Postal": str}, low_memory=False)

# Reemplazar NaN según el tipo de dato
for col in df.columns:
    if df[col].dtype in ["float64", "int64"]:
        df[col] = df[col].fillna(0)
    else:
        df[col] = df[col].fillna("sin datos")

# Conexión a MySQL
conexion = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Ma260512!!",
    database="busquedadatos"
)
cursor = conexion.cursor()

insertados = 0
repetidos = 0
errores = 0

for _, fila in df.iterrows():
    rut = fila["RUT"]
    try:
        cursor.execute("SELECT COUNT(*) FROM provedoresdelestadouy WHERE rut = %s", (rut,))
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO provedoresdelestadouy 
                (rut, denominacion_social, correo_electronico, telefono, actividad_comercial,
                 domicilio, otros_datos, ciudad, departamento, codigo_postal, clasificacion)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                fila["RUT"],
                fila["Denominación Social"],
                fila["Correo electronico público"],
                fila["Nro. Telefono"],
                fila["ACTIVIDAD COMERCIAL"],
                fila["DOMICILIO"],
                fila["Otros datos"],
                fila["CIUDAD"],
                fila["Departamento"],
                fila["Codigo Postal"],
                fila["CLASIFICACION"]
            ))
            insertados += 1
        else:
            repetidos += 1
    except Exception as e:
        errores += 1
        print(f"⚠️ Error al insertar RUT {rut}: {e}")

conexion.commit()
conexion.close()

print(f"\n✅ Registros insertados: {insertados}")
print(f"🔁 Registros repetidos: {repetidos}")
print(f"❌ Errores: {errores}")






