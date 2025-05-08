from fuentes.buscar_coincidencias_fuentes import buscar_coincidencias_fuentes
from resultados.guardar_resultados import guardar_resultado_busqueda
from datetime import datetime
from fuentes.validaciones import validar_cedula_uruguaya, validar_rut_uruguayo
from fuentes.busqueda_google import buscar_en_google
from resultados.guardar_google import guardar_resultados_google
from db.conexion_localizador import obtener_conexion_busqueda


def main():
    print("🔍 BUSCADOR DE PERSONAS")
    print("-----------------------")

    nombre = input("🧍 Nombre completo: ").strip()
    cedula = input("🪪 Cédula o RUT (opcional): ").strip()
    telefono = input("📞 Teléfono (opcional): ").strip()
    direccion = input("🏠 Dirección (opcional): ").strip()
    fecha_nac_input = input("📅 Fecha de nacimiento (YYYY-MM-DD, opcional): ").strip()
    pais = input("🌎 País: ").strip()
    departamento = input("🏞️ Departamento (opcional): ").strip()
    ciudad = input("🏙️ Ciudad (opcional): ").strip()

    # Validación de fecha
    fecha_nacimiento = None
    if fecha_nac_input:
        try:
            fecha_nacimiento = datetime.strptime(fecha_nac_input, "%Y-%m-%d").date()
        except ValueError:
            print("⚠️  Fecha inválida. Se omitirá.")

    # Validación de cédula/RUT y tipo_persona
    tipo_persona = ""
    es_valido = True

    if pais.lower() == "uruguay" and cedula:
        cedula_limpia = cedula.replace(".", "").replace("-", "")
        if len(cedula_limpia) <= 8:
            es_valido = validar_cedula_uruguaya(cedula_limpia)
            tipo_persona = "Física"
        else:
            es_valido = validar_rut_uruguayo(cedula_limpia)
            tipo_persona = "Jurídica"

        if not es_valido:
            print("⚠️ El documento ingresado NO es válido para Uruguay.")
            cedula = None
            tipo_persona = input("⚠️ Seleccione tipo de persona manualmente (Física/Jurídica): ").strip().capitalize()
    else:
        tipo_persona = input("👤 Tipo de persona (Física/Jurídica): ").strip().capitalize()

    # Validación final del ENUM
    if tipo_persona not in ["Física", "Jurídica"]:
        print("⚠️ Tipo inválido. Se usará 'Física' por defecto.")
        tipo_persona = "Física"

    print("\n🔎 Buscando coincidencias en base de datos...\n")
    resultados = buscar_coincidencias_fuentes(nombre, telefono or None, direccion or None, departamento or None, cedula or None)

    for tipo, coincidencias in resultados.items():
        print(f"\n🔹 {tipo.upper()} ({len(coincidencias)} resultados)")
        for p in coincidencias:
            if tipo == "empresas_uruguay":
                print(f"  - {p.get('nombre_empresa')} | 📞 {p.get('telefono')} | {p.get('direccion')} | {p.get('localidad', '')} ({p.get('departamento', '')})")
            elif tipo == "proveedores_estado":
                print(f"  - {p.get('denominacion_social')} | 📞 {p.get('telefono')} | {p.get('domicilio')} ({p.get('departamento', '')})")
            else:
                print(f"  - {p.get('nombre')} {p.get('apellido', '')} | 🪪 {p.get('cedula')} | 📞 {p.get('telefono')} | {p.get('direccion')} | {p.get('ciudad', '')} ({p.get('departamento', '')})")

            if p.get("contacto_interno"):
                print("     📌 GM Interno detectado:")
                print(f"     → Nombre GM: {p.get('nombre_contacto_interno')}")
                print(f"     → Teléfono GM: {p.get('telefono_contacto_interno')}")
                print(f"     → Coincidencia: {p.get('tipo_contacto_interno')}")

    # Guardar búsqueda principal
    guardar_resultado_busqueda(
        nombre_ingresado=nombre,
        cedula=cedula or None,
        telefono=telefono or None,
        direccion=direccion or None,
        fecha_nacimiento=fecha_nacimiento,
        pais=pais or None,
        departamento=departamento or None,
        ciudad=ciudad or None,
        tipo_persona=tipo_persona,
        coincidencias=resultados
    )

    # Obtener ID de búsqueda recién guardada
    conn = obtener_conexion_busqueda()
    cursor = conn.cursor()
    cursor.execute("SELECT MAX(id_busqueda) FROM busquedas")
    id_busqueda = cursor.fetchone()[0]
    cursor.close()
    conn.close()

    # 🌐 Búsquedas escalonadas en Google con etiqueta
    print("\n🌐 Realizando búsqueda escalonada en Google...")

    busquedas_google = [
        (f"{nombre}", "nombre") if nombre else None,
        (f"{nombre} {cedula}", "nombre + cedula") if nombre and cedula else None,
        (f"{telefono}", "telefono") if telefono else None,
        (f"{nombre} {ciudad or ''} {pais or ''}".strip(), "nombre + lugar") if nombre and (ciudad or pais) else None,
        (f"{direccion} {ciudad or ''} {pais or ''}".strip(), "direccion + lugar") if direccion and (ciudad or pais) else None
    ]

    todos_los_resultados = []

    for item in busquedas_google:
        if not item:
            continue
        consulta, tipo_busqueda = item
        print(f"\n🔎 Google ({tipo_busqueda}): {consulta}")
        resultados = buscar_en_google(consulta)
        if resultados:
            guardar_resultados_google(id_busqueda, consulta, resultados, tipo_busqueda)
            todos_los_resultados.extend(resultados)

    todos_los_resultados = list(set(todos_los_resultados))

    if todos_los_resultados:
        print(f"\n📄 Resultados guardados en Google ({len(todos_los_resultados)}):")
        for r in todos_los_resultados[:10]:
            print(r)
    else:
        print("⚠️ No se encontraron resultados en Google.")


if __name__ == "__main__":
    main()

