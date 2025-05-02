from flask import Blueprint, request, jsonify
import os
import requests
from .auth import login_sc

sbi_bp = Blueprint('sbi', __name__, url_prefix='/sbi')

@sbi_bp.route('/sbi', methods=['POST'])
def cotizacion_sbi():
    BASE_URL = os.getenv('SBI_BASE_URL')
    
    headers = {
        # 'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }

    payload = request.get_json()

    try:
        response = requests.post(f'{BASE_URL}/vehiculos/Cotizacion/commission-discount-auto', headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
