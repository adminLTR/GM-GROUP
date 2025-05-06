import requests
import json

API_KEY = "AIzaSyBavpxLJOUR9POUTTvD4KuQkzO_nqsIQyQ"
CX = "37fc6ccaaeeb14129"

def test_google_api(query):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": API_KEY,
        "cx": CX,
        "q": query,
        "num": 5
    }

    response = requests.get(url, params=params)
    print(f"🔍 URL final: {response.url}")
    print("📡 Estado HTTP:", response.status_code)
    print("📦 Respuesta JSON:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))

if __name__ == "__main__":
    nombre = "Marcelo Asencio Salto Uruguay"
    test_google_api(nombre)
