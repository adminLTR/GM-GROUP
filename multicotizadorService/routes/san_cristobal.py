from flask import Blueprint, request, jsonify
import os
import requests
from .auth import login_sc

sc_bp = Blueprint('san-cristobal', __name__, url_prefix='/san-cristobal')

@sc_bp.route('/san-cristobal', methods=['POST'])
def cotizacion_sc():
    BASE_URL = os.getenv('SAN_CRISTOBAL_BASE_URL')
    SAN_CRISTOBAL_USER = os.getenv('SAN_CRISTOBAL_USER')
    SAN_CRISTOBAL_PASS = os.getenv('SAN_CRISTOBAL_PASS')
    
    TOKEN = login_sc(BASE_URL+"/api/Auth/LoginAsync", SAN_CRISTOBAL_USER, SAN_CRISTOBAL_PASS)

    if not TOKEN:
        return jsonify({"error": "Error de autenticación"}), 401

    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }

    payload = request.get_json()

    try:
        response = requests.post(f'{BASE_URL}/api/quote/auto', headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
