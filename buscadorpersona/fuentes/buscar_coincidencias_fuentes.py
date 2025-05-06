from fuentes.busqueda_interna import buscar_en_base_personas
from fuentes.busqueda_contactos_internos import buscar_en_contactos_internos
from fuentes.busqueda_bdempresasuruguay import buscar_en_bdempresasuruguay
from fuentes.buscar_en_proveedores_estado  import buscar_en_proveedores_estado  # ✅ Nuevo import

def buscar_coincidencias_fuentes(nombre_completo, telefono=None, direccion=None, departamento=None, rut=None):
    resultados = {}

    # 🔎 Fuente 1: Base de personas (seguros)
   # resultado_persona = buscar_en_base_personas(nombre_completo, telefono, direccion)
   # if resultado_persona:
      #  resultados["persona"] = resultado_persona #

    # 🔎 Fuente 2: Contactos internos GM
    resultado_contacto = buscar_en_contactos_internos(nombre_completo, telefono)
    if resultado_contacto:
        resultados["contacto_interno"] = resultado_contacto

    # 🔎 Fuente 3: Empresas Uruguay
    resultado_empresas = buscar_en_bdempresasuruguay(nombre_completo, telefono, direccion)
    if resultado_empresas:
        resultados["empresas_uruguay"] = resultado_empresas

    # 🔎 Fuente 4: Proveedores del Estado (nuevo)
    resultado_proveedores = buscar_en_proveedores_estado(
        nombre=nombre_completo,
        telefono=telefono,
        direccion=direccion,
        departamento=departamento,
        rut=rut
    )
    if resultado_proveedores:
        resultados["proveedores_estado"] = resultado_proveedores

    return resultados

