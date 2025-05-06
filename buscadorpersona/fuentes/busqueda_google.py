import requests

API_KEY = "AIzaSyBavpxLJOUR9POUTTvD4KuQkzO_nqsIQyQ"
CX = "37fc6ccaaeeb14129"

def buscar_en_google(query, cantidad=5):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": API_KEY,
        "cx": CX,
        "q": query,
        "num": cantidad
    }

    resultados = []

    try:
        response = requests.get(url, params=params)
        data = response.json()

        for item in data.get("items", []):
            titulo = item.get("title")
            enlace = item.get("link")
            snippet = item.get("snippet")
            resultados.append(f"{titulo}\n{snippet}\n🔗 {enlace}\n")

    except Exception as e:
        print(f"❌ Error al buscar en Google: {e}")

    return resultados
