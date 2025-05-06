from google.cloud import vision
import pprint
import io
import os
import re

# Autenticación
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "vision-service.json"

def extraer_texto_de_imagen(ruta_imagen):
    client = vision.ImageAnnotatorClient()

    with io.open(ruta_imagen, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        print("No se encontró texto.")
        return

    # Unimos todo el texto detectado en un solo string
    texto_completo = texts[0].description.replace('\n', ' ').upper()

    # Diccionario de resultados
    datos = {
        "matricula": re.search(r'MATRICULA\s+([A-Z]{3}\s?\d{4})', texto_completo),
        "marca": re.search(r'MARCA\s*:?[\s]*([A-Z]+)', texto_completo),
        "modelo": re.search(r'MODELO.*?(SUZUKI.*?)\sTIPO', texto_completo),
        "tipo": re.search(r'TIPO\s*:?[\s]*([A-Z0-9\s]+?)\s+ATRIBUTO', texto_completo),
        "año": re.search(r'ATRIBUTO\s*:?[\s]*(\d{4})', texto_completo),
        "combustible": re.search(r'COMB\s*\.?\s*:?[\s]*([A-Z]+)', texto_completo),
        "cilindrada": re.search(r'CILINDRADA\s*:?[\s]*(\d+)', texto_completo),
        "nro_motor": re.search(r'MOTOR\s*:?[\s]*([A-Z0-9]+)', texto_completo),
        "nro_chasis": re.search(r'CHASIS\s*:?[\s]*([A-Z0-9]+)', texto_completo),
        "titular": re.search(r'TITULAR.*?:\s*([\w\s,]+?)\s+EJES', texto_completo),
        "pasajeros": re.search(r'PASAJEROS\s*:?[\s]*(\d+)', texto_completo),
        "ci_rut": re.search(r'C\.I\.\/R\.U\.T\s*\.?:\s*([\d\-]+)', texto_completo)
    }

    # Convertimos los matches en texto plano
    datos_limpios = {k: (v.group(1).strip() if v else None) for k, v in datos.items()}

    return datos_limpios

# Ejecuta
datos_extraidos = extraer_texto_de_imagen("document_propiedad2.jpeg")
pprint.pprint(datos_extraidos)
