import requests


# xml_body = """<?xml version="1.0" encoding="UTF-8"?>
# <Request>
#   <Entity>Auto</Entity>
#   <Params>
#      <Param Name="cod_usuario" Value="WEB5842" />
#      <Param Name="cod_subramo" Value="1" />
#      <Param Name="cod_marca" Value="77" />
#      <Param Name="cod_modelo" Value="2035" />
#      <Param Name="aaaa_fabrica" Value="2018" />
#      <Param Name="cod_area" Value="1" />
#      <Param Name="edad_conductor" Value="40" />
#      <Param Name="cod_uso" Value="1" />
#      <Param Name="cod_manejo" Value="2" />
#      <Param Name="ncd" Value="6" />
#      <Param Name="cod_moneda" Value="0" />
#      <Param Name="accidentes" Value="1" />
#      <Param Name="cant_desc_cliente" Value="0" />
#      <Param Name="top_driver" Value="0" />
#      <Param Name="str_fecha" Value="02/12/2024" />
#      <Param Name="cod_agente" Value="5842" />
#      <Param Name="cod_agencia" Value="10" />
#      <Param Name="pje_descuento" Value="0" />
#      <Param Name="pje_recargo" Value="0" />
#      <Param Name="cant_deducible" Value="1" />
#   </Params>
# </Request>"""

# import base64

# username = "WEB"
# password = "Sura2025.2025W"
# auth_string = f"{username}:{password}"
# auth_bytes = base64.b64encode(auth_string.encode()).decode()

# headers = {
#     "Authorization": f"Basic {auth_bytes}",
#     "Content-Type": "application/xml"
# }

# try:
#     response = requests.post(f"https://test.segurossura.com.uy/CotizadoresBlock/FachadaCotizador.asmx", headers=headers, data=xml_body)
#     response.raise_for_status()
#     print(response.text, 200, {'Content-Type': 'application/xml'})

# except requests.exceptions.RequestException as e:
#     print(({"error": str(e)}), 500)

import requests
import pprint

def login_sc(api_url: str, username: str, password: str) -> str:
    """
    Realiza login en la API y retorna el token.
    """
    payload = {
        'UserName': username,
        'Password': password
    }

    try:
        response = requests.post(api_url + '/api/Auth/LoginAsync', json=payload)
        data = response.json()
        response.raise_for_status()
        return data.get('Auth_Token')

    except requests.exceptions.RequestException as e:
        print(f"Error en el login: {e}")
        return None


# Configuración
BASE_URL = 'https://api-uat.sancristobalonline.com.ar/b2b-uruguay-gateway'
USERNAME = 'B2B_Actibox_UY'
PASSWORD = '7Y8F0WsLrY9tK86j'

# Paso 1: Login
token = login_sc(BASE_URL, USERNAME, PASSWORD)

if token:
    # Paso 2: Configurar headers con el token
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/json'
    }

    try:
        # Paso 3: Hacer la solicitud GET
        response = requests.get(BASE_URL + '/api/catalogo/tipos-de-personas', headers=headers)
        response.raise_for_status()
        datos = response.json()
        print('Datos obtenidos correctamente:')
        pprint.pprint(datos)

    except requests.exceptions.RequestException as e:
        print(f'Ocurrió un error en la solicitud: {e}')


    try:
        # Paso 3: Hacer la solicitud GET
        response = requests.get(BASE_URL + '/api/catalogo/monedas', headers=headers)
        response.raise_for_status()
        datos = response.json()
        print('Datos obtenidos correctamente:')
        pprint.pprint(datos)

    except requests.exceptions.RequestException as e:
        print(f'Ocurrió un error en la solicitud: {e}')
    
    try:
        # Paso 3: Hacer la solicitud GET
        response = requests.get(BASE_URL + '/api/catalogo/usos', headers=headers)
        response.raise_for_status()
        datos = response.json()
        print('Datos obtenidos correctamente:')
        pprint.pprint(datos)

    except requests.exceptions.RequestException as e:
        print(f'Ocurrió un error en la solicitud: {e}')
    
    try:
        # Paso 3: Hacer la solicitud GET
        response = requests.get(BASE_URL + '/api/catalogo/alternativas-comerciales', headers=headers)
        response.raise_for_status()
        datos = response.json()
        print('Datos obtenidos correctamente:')
        pprint.pprint(datos)

    except requests.exceptions.RequestException as e:
        print(f'Ocurrió un error en la solicitud: {e}')
    
    try:
        # Paso 3: Hacer la solicitud GET
        response = requests.get(BASE_URL + '/api/catalogo/vehiculos-cortesia', headers=headers)
        response.raise_for_status()
        datos = response.json()
        print('Datos obtenidos correctamente:')
        pprint.pprint(datos)

    except requests.exceptions.RequestException as e:
        print(f'Ocurrió un error en la solicitud: {e}')
    
    try:
        # Paso 3: Hacer la solicitud GET
        response = requests.get(BASE_URL + '/api/catalogo/vehiculos-sc', headers=headers)
        response.raise_for_status()
        datos = response.json()
        print('Datos obtenidos correctamente:')
        pprint.pprint(datos)

    except requests.exceptions.RequestException as e:
        print(f'Ocurrió un error en la solicitud: {e}')
else:
    print("No se pudo obtener el token, login fallido.")