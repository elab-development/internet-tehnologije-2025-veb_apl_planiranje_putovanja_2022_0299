import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const searchHotels = async (query: string) => {
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://tripadvisor-scraper.p.rapidapi.com/hotels/list',
    params: {
      query: query,
      page: '1',
    },
    headers: {
      'x-rapidapi-key': '8e80b71190msh6766b31f564c0d4p1083c3jsnc2d0c302de09',
      'x-rapidapi-host': 'tripadvisor-scraper.p.rapidapi.com',
    },
  };

  try {
    const response: AxiosResponse<any> = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};