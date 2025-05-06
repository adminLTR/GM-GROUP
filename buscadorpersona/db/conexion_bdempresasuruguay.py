import mysql.connector

def obtener_conexion_bdempresasuruguay():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Ma260512!!",
        database="busquedadatos"
    )

