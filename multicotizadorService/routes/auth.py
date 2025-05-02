import requests

def login_sc(api_url:str, username:str, password:str):
    payload = {
        'UserName': username,
        'Password': password
    }

    try:
        response = requests.post(api_url, json=payload)
        data = response.json()
        response.raise_for_status() 

        return data.get('Auth_Token') 

    except requests.exceptions.RequestException as e:
        print(f"Error en la solicitud: {e}")
        return None
