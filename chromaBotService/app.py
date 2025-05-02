from flask import Flask, request, jsonify
from flask_cors import CORS
import chromadb
import pprint
from seed import obtener_categoria_por_nombre, DB_DIR

app = Flask(__name__)
CORS(app) 

client = chromadb.PersistentClient(path=DB_DIR)

def filter_results(results):
    response = []
    for i in range(len(results['ids'][0])):
        if results['distances'][0][i] < .7:
            response.append({
                'id': results['ids'][0][i],
                'document': results['documents'][0][i],
                'distance': results['distances'][0][i],
                'metadata': results['metadatas'][0][i] if results['metadatas'] else {}
            })
    pprint.pprint(response)
    return response

@app.route('/query', methods=['POST'])
def query_collection():
    data = request.get_json()
    if not data or 'query' not in data or "corredor" not in data:
        return jsonify({'error': 'Se requiere "query" y "corredor" en el cuerpo de la solicitud'}), 400

    query_text = data['query']
    n_results = data.get('n_results', 1) 
    corredor = data.get('corredor') 

    collection = client.get_collection(name=f"personal_{corredor}_db")

    results = collection.query(
        query_texts=[query_text],
        n_results=n_results
    )
        
    if results and results['ids'] and len(results['ids'][0]) > 0:
        response = filter_results(results)
        c = f"corredor {corredor}"
        if len(response) <= 0:
            collection = client.get_collection(name=f"general_db")
            results = collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            response = filter_results(results)
            c = "general"
        return jsonify({'results': response, 'db':c})
    else:
        collection = client.get_collection(name=f"general_db")
        results = collection.query(
            query_texts=[query_text],
            n_results=n_results
        )
        response = filter_results(results)
        c = "general"
        return jsonify({'results': response, 'db':c})


@app.route('/add_chroma_data', methods=['POST'])
def add_chroma_data():
    """
    Recibe los datos del formulario y los añade a ChromaDB.
    """
    data = request.get_json()
    if not data or 'input' not in data:
        return jsonify({'error': 'Se requiere el campo "input" en el cuerpo de la solicitud'}), 400

    input_chroma = data['input']
    categoria = data.get('categoria')
    respuesta = data.get('respuesta')

    corredor = data.get('corredor', 0)

    if int(corredor) == 0:
        collection = client.get_or_create_collection(name=f"general_db")
    else:
        collection = client.get_or_create_collection(name=f"personal_{corredor}_db")

    ids=[id for id in collection.get()['ids'] if id.startswith(f"{categoria.lower()}-")]
    doc_id = f"{categoria.lower()}-{len(ids) + 1}"

    cat = obtener_categoria_por_nombre(categoria)

    metadata = {}
    if respuesta:
        metadata['answer'] = respuesta
        metadata['value'] = cat['value']

    collection.add(
        ids=[doc_id],
        documents=[input_chroma],
        metadatas=[metadata]
    )

    return jsonify({'message': f'Respuesta con ID "{doc_id}" agregada correctamente a ChromaDB'}), 201


@app.route('/get_documents_by_category/<corredor>/<category>', methods=['GET'])
def get_documents_by_category(corredor, category):
    """
    Devuelve todos los documentos que tienen un ID que comienza con la categoría especificada.
    """

    if int(corredor) == 0:
        collection = client.get_collection(name=f"general_db")
    else:
        collection = client.get_collection(name=f"personal_{corredor}_db")

    lista = [id for id in collection.get()['ids'] if id.startswith(f"{category.lower()}-")]
    results = None
    if len(lista) > 0:
        results = collection.get(
            ids=lista,
            include=['documents', 'metadatas']
        )

    if results and results['ids']:
        response = []
        for i, doc_id in enumerate(results['ids']):
            response.append({
                'id': doc_id,
                'document': results['documents'][i] if results['documents'] else None,
                'metadata': results['metadatas'][i] if results['metadatas'] else {}
            })
        return jsonify({'results': response})
    else:
        return jsonify({'results': []})

if __name__ == '__main__':
    app.run(debug=True)