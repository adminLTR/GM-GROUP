import mysql.connector

def obtener_conexion():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        # password="Ma260512!!",
        password="",
        database="sistema_seguros"
    )
