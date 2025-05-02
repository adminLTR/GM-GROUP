import csv
import mysql.connector

# Configuración de conexión a tu base de datos
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Ma260512!!',
    'database': 'sistema_seguros'
}

# Conectar a la base de datos
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Ruta de tu archivo CSV
csv_file_path = './data.csv'

# Definir el INSERT SQL
insert_sql = """
INSERT INTO auto_data (
    cod_marca, MarcaSura, cod_modelo, ModeloSura, aaaa_fabrica,
    cod_tipo_veh, TipoVehiculoSura, cod_marca_autodata, MarcaAutoData,
    cod_modelo_autodata, ModeloAutodata, ValorAutodata,
    ExisteAnioEnAutodata, CantVehiculosVigentes
) VALUES (
    %s, %s, %s, %s, %s,
    %s, %s, %s, %s,
    %s, %s, %s,
    %s, %s
);
"""

# Cantidad de registros por bloque
batch_size = 500

# Lista temporal para ir guardando los valores
batch_data = []

with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Crear una tupla con los datos en el mismo orden que el INSERT
        cod = int(row['cod_tipo_veh'])
        if cod == 1 or cod == 11 or cod == 13:
            record = (
                int(row['cod_marca']) if row['cod_marca'] else None,
                row['MarcaSura'],
                int(row['cod_modelo']) if row['cod_modelo'] else None,
                row['ModeloSura'],
                int(row['aaaa_fabrica']) if row['aaaa_fabrica'] else None,
                int(row['cod_tipo_veh']) if row['cod_tipo_veh'] else None,
                row['TipoVehiculoSura'],
                int(row['cod_marca_autodata']) if row['cod_marca_autodata'] else None,
                row['MarcaAutoData'],
                int(row['cod_modelo_autodata']) if row['cod_modelo_autodata'] else None,
                row['ModeloAutodata'],
                float(row['ValorAutodata']) if row['ValorAutodata'] else None,
                int(row['ExisteAnioEnAutodata']) if row['ExisteAnioEnAutodata'] else None,
                int(row['CantVehiculosVigentes']) if row['CantVehiculosVigentes'] else None
            )
            batch_data.append(record)

        # Cuando llegamos al tamaño del batch, ejecutamos el insert
        if len(batch_data) >= batch_size:
            cursor.executemany(insert_sql, batch_data)
            conn.commit()
            print(f"Insertados {len(batch_data)} registros...")
            batch_data.clear()

# Insertar los registros restantes que no llenaron un batch completo
if batch_data:
    cursor.executemany(insert_sql, batch_data)
    conn.commit()
    print(f"Insertados {len(batch_data)} registros finales...")

# Cerrar conexión
cursor.close()
conn.close()

print("✅ ¡Importación completa!")
