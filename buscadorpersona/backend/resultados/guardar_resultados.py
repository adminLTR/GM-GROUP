from db.conexion_mysql import obtener_conexion
from fuentes.validaciones import validar_cedula_uruguaya, validar_rut_uruguayo
from fuentes.buscar_coincidencias import buscar_contacto_interno
from utils.utils import calcular_confianza

def guardar_resultado_busqueda(
    nombre_ingresado,
    cedula,
    telefono,
    direccion,
    fecha_nacimiento,
    pais,
    departamento,
    ciudad,
    tipo_persona,
    coincidencias
):
    conn = obtener_conexion("busquedadatos")
    cursor = conn.cursor()

    # 1. Insertar la búsqueda principal
    cursor.execute("""
        INSERT INTO busquedas (
            nombre_ingresado, cedula, telefono, direccion,
            fecha_nacimiento, pais, departamento, ciudad, tipo_persona
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        nombre_ingresado, cedula, telefono, direccion,
        fecha_nacimiento, pais, departamento, ciudad, tipo_persona
    ))

    id_busqueda = cursor.lastrowid

    # 2. Insertar coincidencias encontradas
    for tipo, coincidencias_encontradas in coincidencias.items():
        for p in coincidencias_encontradas:

            if tipo == "empresas_uruguay":
                cursor.execute("""
                    INSERT INTO coincidencias (
                        id_busqueda, tipo_coincidencia, grado_confianza, pais, tipo_persona,
                        nombre_empresa_uy, direccion_empresa_uy, departamento_empresa_uy,
                        ciudad_empresa_uy, telefono_empresa_uy, email_empresa_uy,
                        web_empresa_uy, actividad_empresa_uy
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    id_busqueda,
                    tipo,
                    "MEDIA",
                    "Uruguay",
                    "Jurídica",
                    p.get("nombre_empresa"),
                    p.get("direccion"),
                    p.get("departamento"),
                    p.get("localidad"),
                    p.get("telefono"),
                    p.get("email"),
                    p.get("pagina_web"),
                    p.get("actividad_economica")
                ))

            elif tipo == "proveedores_estado":
                cursor.execute("""
                    INSERT INTO coincidencias (
                        id_busqueda,
                        tipo_coincidencia,
                        grado_confianza,
                        pais,
                        tipo_persona,
                        rut_proveedor_estado,
                        denominacion_social_estado,
                        correo_electronico_estado,
                        telefono_estado,
                        actividad_comercial_estado,
                        domicilio_estado,
                        otros_datos_estado,
                        ciudad_estado,
                        departamento_estado,
                        codigo_postal_estado,
                        clasificacion_estado
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    id_busqueda,
                    tipo,
                    "MEDIA",
                    "Uruguay",
                    "Jurídica",
                    p.get("rut"),
                    p.get("denominacion_social"),
                    p.get("correo_electronico"),
                    p.get("telefono"),
                    p.get("actividad_comercial"),
                    p.get("domicilio"),
                    p.get("otros_datos"),
                    p.get("ciudad"),
                    p.get("departamento"),
                    p.get("codigo_postal"),
                    p.get("clasificacion")
                ))

            else:
                documento_valido = None
                cedula_encontrada = p.get("cedula")

                if cedula_encontrada:
                    cedula_limpia = cedula_encontrada.replace(".", "").replace("-", "")
                    if cedula_limpia.isdigit():
                        if len(cedula_limpia) <= 8:
                            documento_valido = validar_cedula_uruguaya(cedula_limpia)
                        else:
                            documento_valido = validar_rut_uruguayo(cedula_limpia)
                    else:
                        documento_valido = False

                contacto_info = buscar_contacto_interno(
                    f"{p.get('nombre', '')} {p.get('apellido', '')}",
                    p.get("telefono", "")
                )

                contacto_interno = contacto_info["contacto_interno"]
                tipo_contacto_interno = contacto_info["tipo_contacto_interno"]
                nombre_contacto_interno = contacto_info["nombre_contacto_interno"]
                telefono_contacto_interno = contacto_info["telefono_contacto_interno"]

                cursor.execute("""
                    INSERT INTO coincidencias (
                        id_busqueda, nombre, apellido, cedula, telefono, direccion,
                        ciudad, departamento, pais, fecha_nacimiento, tipo_persona,
                        tipo_coincidencia, grado_confianza, documento_valido,
                        contacto_interno, tipo_contacto_interno,
                        nombre_contacto_interno, telefono_contacto_interno
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    id_busqueda,
                    p.get("nombre"),
                    p.get("apellido"),
                    p.get("cedula"),
                    p.get("telefono"),
                    p.get("direccion"),
                    p.get("ciudad"),
                    p.get("departamento"),
                    "Uruguay",
                    p.get("fecha_nacimiento"),
                    p.get("tipo_persona", "Física"),
                    tipo,
                    calcular_confianza(tipo),
                    documento_valido,
                    contacto_interno,
                    tipo_contacto_interno,
                    nombre_contacto_interno,
                    telefono_contacto_interno
                ))

    conn.commit()
    cursor.close()
    conn.close()
    print(f"✅ Búsqueda guardada con ID: {id_busqueda}")

