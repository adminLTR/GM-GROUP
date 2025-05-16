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