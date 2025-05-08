import subprocess
import os

# Ruta a los proyectos
BACKEND_PATH = os.path.abspath("./backend")
FRONTEND_PATH = os.path.abspath("./frontend")

# Comandos
backend_command = ["uvicorn", "api:app", "--reload", "--port", "8000"]
frontend_command = ["npm", "run", "dev"]

# Iniciar backend
backend_process = subprocess.Popen(
    backend_command,
    cwd=BACKEND_PATH
)

# Iniciar frontend
frontend_process = subprocess.Popen(
    frontend_command,
    cwd=FRONTEND_PATH,
    shell=True
)

print("✅ Servidores ejecutándose. Presioná Ctrl+C para detenerlos.")

try:
    backend_process.wait()
    frontend_process.wait()
except KeyboardInterrupt:
    print("\n🛑 Deteniendo servidores...")
    backend_process.terminate()
    frontend_process.terminate()
