from pydantic import BaseModel

class LoginInput(BaseModel):
    username: str
    password: str

class Usuario(BaseModel):
    username: str
    password: str
    nombres: str
    email: str
    telefono: str
    superuser: bool