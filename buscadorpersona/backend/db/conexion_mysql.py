import mysql.connector

import os

def obtener_conexion(db:str):
    return mysql.connector.connect(
        # password="Ma260512!!",
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=db or os.getenv("DB_BUSQUEDA_NAME")
    )