from flask import Blueprint, request, jsonify
import os
import requests
from .auth import login_sc

sura_bp = Blueprint('sura', __name__, url_prefix='/sura')


@sura_bp.route('/sura', methods=['POST'])
def cotizacion_sura():
    BASE_URL = os.getenv('SURA_BASE_URL')
    SURA_USER = os.getenv('SURA_USER')
    SURA_PASS = os.getenv('SURA_PASS')

    # Login para obtener el token
    TOKEN = login_sc(BASE_URL, SURA_USER, SURA_PASS)

    if not TOKEN:
        return jsonify({"error": "Error de autenticación con Sura"}), 401

    # Leer parámetros desde JSON del request y construir XML manualmente
    data = request.get_json()

    xml_body = f"""<?xml version="1.0" encoding="UTF-8"?>
    <Request>
    <Entity>Auto</Entity>
    <Params>
        <Param Name="cod_usuario" Value="{data.get('cod_usuario', 'WEB5842')}" />
        <Param Name="cod_subramo" Value="{data.get('cod_subramo', '1')}" />
        <Param Name="cod_marca" Value="{data.get('cod_marca', '77')}" />
        <Param Name="cod_modelo" Value="{data.get('cod_modelo', '2035')}" />
        <Param Name="aaaa_fabrica" Value="{data.get('aaaa_fabrica', '2018')}" />
        <Param Name="cod_area" Value="{data.get('cod_area', '1')}" />
        <Param Name="edad_conductor" Value="{data.get('edad_conductor', '40')}" />
        <Param Name="cod_uso" Value="{data.get('cod_uso', '1')}" />
        <Param Name="cod_manejo" Value="{data.get('cod_manejo', '2')}" />
        <Param Name="ncd" Value="{data.get('ncd', '6')}" />
        <Param Name="cod_moneda" Value="{data.get('cod_moneda', '0')}" />
        <Param Name="accidentes" Value="{data.get('accidentes', '1')}" />
        <Param Name="cant_desc_cliente" Value="{data.get('cant_desc_cliente', '0')}" />
        <Param Name="top_driver" Value="{data.get('top_driver', '0')}" />
        <Param Name="str_fecha" Value="{data.get('str_fecha', '02/12/2024')}" />
        <Param Name="cod_agente" Value="{data.get('cod_agente', '5842')}" />
        <Param Name="cod_agencia" Value="{data.get('cod_agencia', '10')}" />
        <Param Name="pje_descuento" Value="{data.get('pje_descuento', '0')}" />
        <Param Name="pje_recargo" Value="{data.get('pje_recargo', '0')}" />
        <Param Name="cant_deducible" Value="{data.get('cant_deducible', '1')}" />
    </Params>
    </Request>"""

    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/xml"
    }

    try:
        response = requests.post(f"{BASE_URL}/api/cotizacion", headers=headers, data=xml_body)
        response.raise_for_status()
        return response.text, 200, {'Content-Type': 'application/xml'}

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500