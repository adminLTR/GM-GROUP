import mysql.connector

def obtener_conexion_busquedadatos():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="busquedadatos"
    )

