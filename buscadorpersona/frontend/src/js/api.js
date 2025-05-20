import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function getDepartamentos() {
    const response = await axios.get(API_URL + "/empresas/departamentos");
    return response.data;
}
export async function getActividades() {
    const response = await axios.get(API_URL + "/empresas/actividades");
    return response.data;
}
export async function getEmpresasFiltro(params) {
    const response = await axios.get(API_URL + `/empresas/filtrar?${params}`);
    return response.data;
}
export async function agregarEmpresa(data) {
    const response = await axios.post(API_URL + "/empresas/agregar", data);
    return response.data;
}
export async function enviarEmailKanban(data) {
    const response = await axios.post(API_URL + "/kanban/enviar-emails", data);
    return response.data;
}
export async function listarKanban(username) {
    const response = await axios.get(API_URL + `/kanban/listar?username=${username}`);
    return response.data;
}
export async function updateKanban(kanbanId, data) {
    const response = await axios.put(`${API_URL}/kanban/update/${kanbanId}`, data);
    return response.data;
}


export async function getUsers() {
    const response = await axios.get(API_URL + `/users/all`);
    return response.data;
}