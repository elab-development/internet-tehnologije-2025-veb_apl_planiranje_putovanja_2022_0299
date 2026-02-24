import axios from 'axios';
import { API_BASE_URL } from './apiBaseUrl';


export const searchPlacesInDb = async (query: string) => {
    const res = await axios.get(`${API_BASE_URL}/search`, { params: { query } });
    return res.data;
};

export const importFromApi = async (query: string) => {
    return await axios.post(`${API_BASE_URL}/import/destinations`, { query });
};

export const getHotelDetails = async (id: number) => {
    return await axios.get(`${API_BASE_URL}/places/${id}`);
};