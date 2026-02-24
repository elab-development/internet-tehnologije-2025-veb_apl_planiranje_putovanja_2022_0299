import axios from 'axios';
import { API_BASE_URL } from './apiBaseUrl';



export const searchAktivnostiInDb = async (query: string) => {
    const res = await axios.get(`${API_BASE_URL}/aktivnosti/search`, { params: { query } });
    return res.data;
};


export const importAktivnostiFromApi = async (query: string) => {
    return await axios.post(`${API_BASE_URL}/import-aktivnosti`, { query });
};


export const getAktivnostDetails = async (id: string | number) => {
    const res = await axios.get(`${API_BASE_URL}/aktivnosti/${id}`);
    return res.data;
};