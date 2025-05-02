import chromadb

import sqlite3
import shutil
import os

DB_DIR = "./chroma_db"
DB_URL = f"{DB_DIR}/chroma.sqlite3"
COLLECTION_NAME= "general_db"

# La usaremos para borrar la BBDD y volverla a crear
def eliminar_carpeta(url):
    if os.path.exists(url):
        try:
            shutil.rmtree(url)
            print(f"Carpeta '{url}' eliminada exitosamente.")
        except Exception as e:
            print(f"Error al eliminar la carpeta: {e}")
    else:
        print(f"La carpeta '{url}' no existe.")

# Crear y poblar la tabla Categorias
def crear_categorias():
    conn = sqlite3.connect(DB_URL)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            opcion TEXT NOT NULL
        )
    ''')

    # Insertar 5 categorías con su opcion en el chatbot
    categorias = [
        ('asistencia', '5'),
        ('cotizacion', '1'),
        ('estado', '2'),
        ('cambio', '3'),
        ('documentacion', '3'),
        ('baja', '6'),
        ('horario', '7'),
        ('otros', '8'),
    ]

    cursor.executemany('INSERT INTO categorias (nombre, opcion) VALUES (?, ?)', categorias)

    conn.commit()
    conn.close()


def obtener_categoria_por_nombre(categoria):
    conn = sqlite3.connect(DB_URL)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM categorias WHERE nombre = ?', (categoria,))
    resultado = cursor.fetchall()[0]

    conn.close()

    return {
        'categoria' : resultado[1],
        'value' : resultado[2],
    }

def seed_chroma(collection, data):
    for key in data.keys():
        categoria = obtener_categoria_por_nombre(key)
        documentos = data[key]
        metadatas = [{'answer': '', 'value': categoria['value']} for _ in documentos]
        ids = [f"{key}-{i}" for i in range(1, len(documentos)+1)]

        # Dividir en bloques pequeños
        for i in range(0, len(documentos), 5):
            collection.add(
                documents=documentos[i:i+5],
                ids=ids[i:i+5],
                metadatas=metadatas[i:i+5]
            )

if __name__ == '__main__':
    eliminar_carpeta(DB_DIR)

    client = chromadb.PersistentClient(path=DB_DIR)
    collection = client.get_or_create_collection(name=COLLECTION_NAME)  

    data = {
        'asistencia' : [
            "como llamo la grua", 
            "necesito una grua", 
            "requiro una grua", 
            "mandenme una grua", 
            "solicito grua", 
            "ayuda con grua", 
            "auxilio grua", 
            "urgente grua", 
            "necesito remolque", 
            "requiere remolque",
            "necesito auxilio mecanico", 
            "como llamo al auxilio mecanico", 
            "estoy sin bateria", 
            "como llamo al guinche", 
            "necesito un guinche", 
            "choque", 
            "tuve un siniestro", 
            "hola recien choque", 
            "necesito perito", 
            "urgente choque"
        ],
        'cotizacion' : [
            "cotizar seguro",
            "quiero cotizar",
            "nuevo seguro",
            "me pasas cotizacion para un seguro ",
            "contratar un seguro de un auto",
            "hacer un seguro para un auto",
            "quiero ponerle seguro a mi auto",
            "hola buenas tardes quiero ponerle un seguro a un auto",
            "quiero ponerle seguro a mi moto",
            "contratar seguro para moto",
            "cual es el precio para el seguro de un auto",
            "seguro con grua",
            "el seguro mas economico",
            "quiero un seguro para mi camioneta",
            "quiero hacer un seguro",
            "cuanto vale seguro para la moto",
            "cuanto vale seguro para la moto"
        ],
        'estado' : [
            "estado de mi seguro",
            "cuando vence mi seguro",
            "tengo vigente el seguro",
            "como estoy con el seguro",
            "que seguro tengo",
            "estado seguro",
            "ver mi seguro"
        ],
        'cambio' :  [
            "cambio vehiculo",
            "cambio de vehiculo",
            "cambiar auto",
            "modificar auto",
            "cambio cobertura",
            "cambio de cobertura",
            "cambiar cobertura",
            "cambio matricula",
            "cambio de matricula",
            "cambiar matricula",
            "vendi mi auto tengo uno nuevo",
            "quiero cambiar la chapa",
            "cambiar circulacion",
            "cambiar de zona",
            "quiero cambiar de cobertura",
            "cambiar el seguro de la moto",
            "quiero cambiar la patente del auto",
            "tengo patente nueva",
            "cambiar la camioneta",
            "quiero cambiarle el seguro a la camioneta"
        ],
        'baja' : [
            "baja seguro",
            "dar de baja",
            "cancelar seguro",
            "no renovar seguro",
            "cancelacion seguro",
            "no renovar",
            "baja póliza",
            "cancelar póliza",
            "cancelacion póliza",
            "terminar seguro",
            "no quiero mas el seguro",
            "no quiero renovar",
            "dame de baja el seguro",
            "cancelame el seguro del auto",
            "cancelame el seguro de la moto",
            "no quiero mas el seguro de la camioneta",
            "dar de baja el seguro",
            "no me renueves",
            "vendi la moto",
            "no tengo mas el auto",
            "Anular seguro"
        ],
        'horario' : [
            "horario de oficina",
            "ubicacion de oficina",
            "direccion de oficina",
            "donde quedas",
            "horario de atencion",
            "oficina",
            "sucursal",
            "direccion",
            "ubicacion",
            "donde estas",
            "en salto donde estan",
            "en maldonado donde estan",
            "para ir a imprimir la poliza",
            "para levantar los papeles de la renovación",
            "donde queda ",
            "hoy estan abierto",
            "manana trabajan ",
            "a que hora abren",
            "de tarde estan",
            "donde levanto la poliza",
            "los sabado trabajan"
        ]
    }

    crear_categorias()
    print("Categorias created")
    seed_chroma(collection, data)
    print("DB SEED")