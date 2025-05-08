def validar_cedula_uruguaya(cedula):
    try:
        cedula = cedula.replace(".", "").replace("-", "").zfill(8)
        nums = list(map(int, cedula))
        coef = [2, 9, 8, 7, 6, 3, 4]
        total = sum([a * b for a, b in zip(nums[:-1], coef)])
        resto = total % 10
        digito_valido = 0 if resto == 0 else 10 - resto
        return digito_valido == nums[-1]
    except:
        return False
def validar_rut_uruguayo(rut):
    try:
        rut = rut.replace(".", "").replace("-", "").zfill(12)
        nums = list(map(int, rut))
        coef = [4, 3, 6, 7, 8, 9, 4, 3, 6, 7, 8]
        total = sum([a * b for a, b in zip(nums[:-1], coef)])
        resto = total % 11
        digito_valido = 0 if resto == 0 else 11 - resto
        return digito_valido == nums[-1]
    except:
        return False
