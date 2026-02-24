import axios from 'axios';
import { API_BASE_URL } from './apiBaseUrl';


export const getRestaurantsDetails = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/places/${id}`);
  return response.data; 
};