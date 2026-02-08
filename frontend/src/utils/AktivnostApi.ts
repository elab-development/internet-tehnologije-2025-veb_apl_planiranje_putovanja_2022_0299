import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

/**
 * Pretražuje već uvezene aktivnosti u tvojoj lokalnoj bazi podataka.
 * Odgovara GET ruti koja vraća podatke iz tabele 'aktivnosti'.
 */
export const searchAktivnostiInDb = async (query: string) => {
    // Pretpostavljamo da imaš rutu npr. /aktivnosti/search u Laravelu
    const res = await axios.get(`${BASE_URL}/aktivnosti/search`, { params: { query } });
    return res.data;
};

/**
 * Poziva tvoj novi ImportAktivnosti kontroler da povuče podatke sa TripAdvisor-a.
 * Ovo je POST zahtev na rutu koju smo definisali.
 */
export const importAktivnostiFromApi = async (query: string) => {
    // Ova putanja mora da se poklapa sa onom u api.php ruti
    return await axios.post(`${BASE_URL}/import-aktivnosti`, { query });
};

/**
 * Dobavlja detalje o jednoj specifičnoj aktivnosti na osnovu ID-ja.
 * Koristi se za stranicu AktivnostDetails.
 */
export const getAktivnostDetails = async (id: string | number) => {
    const res = await axios.get(`${BASE_URL}/aktivnosti/${id}`);
    return res.data;
};