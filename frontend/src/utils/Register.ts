
import axios from 'axios';
import { API_BASE_URL } from './apiBaseUrl';




export const registerUser = async (userData: any) => {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (credentials: any) => {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
};