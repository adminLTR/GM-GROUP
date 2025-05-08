import mysql.connector

def obtener_conexion_busqueda():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="busquedadatos"
    )
