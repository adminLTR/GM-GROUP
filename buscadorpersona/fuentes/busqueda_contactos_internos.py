from fuentes.contacto_interno_mysql import buscar_contacto_interno

def buscar_en_contactos_internos(nombre_completo, telefono=None):
    contacto_nombre = buscar_contacto_interno(nombre_completo, "")
    contacto_telefono = buscar_contacto_interno("", telefono)

    resultados = []

    # Coincidencia por nombre (aunque no coincida el teléfono)
    if contacto_nombre["contacto_interno"]:
        resultados.append({
            "nombre": contacto_nombre["nombre_contacto_interno"],
            "apellido": "",
            "telefono": contacto_nombre["telefono_contacto_interno"],
            "direccion": "Detectado como contacto GM por nombre",
            "ciudad": "",
            "departamento": "",
            "contacto_interno": True,
            "tipo_contacto_interno": contacto_nombre["tipo_contacto_interno"],
            "nombre_contacto_interno": contacto_nombre["nombre_contacto_interno"],
            "telefono_contacto_interno": contacto_nombre["telefono_contacto_interno"]
        })

    # Coincidencia por teléfono (si es otro contacto, lo mostramos también)
    if contacto_telefono["contacto_interno"]:
        # Evitamos duplicar si es la misma persona que coincidió por nombre
        mismo_contacto = (
            contacto_telefono["nombre_contacto_interno"] == contacto_nombre["nombre_contacto_interno"] and
            contacto_telefono["telefono_contacto_interno"] == contacto_nombre["telefono_contacto_interno"]
        )
        if not mismo_contacto:
            resultados.append({
                "nombre": contacto_telefono["nombre_contacto_interno"],
                "apellido": "",
                "telefono": contacto_telefono["telefono_contacto_interno"],
                "direccion": "Propietario del teléfono ingresado",
                "ciudad": "",
                "departamento": "",
                "contacto_interno": True,
                "tipo_contacto_interno": "TELEFONO",
                "nombre_contacto_interno": contacto_telefono["nombre_contacto_interno"],
                "telefono_contacto_interno": contacto_telefono["telefono_contacto_interno"]
            })

    return resultados

