import { useFilter } from '../hooks/useFilter.hook';
import MenuBar from '../components/home/MenuBar';
import HotelList from '../components/search/HotelList';
import RestaurantList from '../components/search/RestaurantList';
import FavoritesList from '../components/search/FavoriteList'; 
import AktivnostList from '../components/search/AktivnostList'; 
import { useSearchedHotels } from '../hooks/useSearchedHotels';
import { useSearchedRestaurants } from '../hooks/useSearchedRestaurants';
import { useSearchedAktivnosti } from '../hooks/useSearchedAktivnost'; 
import { searchPlacesInDb, importFromApi } from '../utils/hotelsApi';
import { searchAktivnostiInDb, importAktivnostiFromApi } from '../utils/AktivnostApi'; 
import { SearchHotel } from '../models/Hotels';
import { SearchRestaurant } from '../models/Restaurant';
import { SearchAktivnost } from '../models/Aktivnost'; 
import { useLoggedIn } from '../hooks/useLoggedIn'; // DODAJ OVO
import UsersList from '../components/search/UserList';

const Home = () => {
  const { filter } = useFilter(); 
  const { user } = useLoggedIn(); 
  const { setSearchedHotels } = useSearchedHotels();
  const { setSearchedRestaurants } = useSearchedRestaurants();
  const { setSearchedAktivnosti } = useSearchedAktivnosti(); // DODAJ OVO

 const handleSearch = async (query: string) => {
  // 1. BLOK ZA HOTELE I RESTORANE
  try {
    let res = await searchPlacesInDb(query);
    
    // Ako nema podataka u bazi, pokrećemo import
    if (!res || res.count === 0) {
      await importFromApi(query);
      res = await searchPlacesInDb(query);
    }

    const data = res.data || [];

    // Mapiranje hotela koristeći tvoj SearchHotel model
    const hotels = data
      .filter((i: any) => i.tip === 'hotel')
      .map((h: any) => new SearchHotel(
        h.id, 
        h.ime, 
        h.prosecna_ocena, 
        h.broj_recenzija, 
        { min: 0, max: 0 }, 
        h.slika || ""
      ));

    // Mapiranje restorana koristeći tvoj SearchRestaurant model
    const restaurants = data
      .filter((i: any) => i.tip === 'restoran')
      .map((r: any) => new SearchRestaurant(
        r.id, 
        r.ime, 
        r.prosecna_ocena, 
        r.broj_recenzija, 
        "$$", 
        r.slika || ""
      ));

    setSearchedHotels(hotels);
    setSearchedRestaurants(restaurants);

  } catch (e) {
    console.error("Hoteli/Restorani greška:", e);
  }

  // 2. POSEBAN BLOK ZA AKTIVNOSTI (Ovde se javlja 500 greška u konzoli)
  try {
    let resAktivnosti = await searchAktivnostiInDb(query);
    
    // Ako baza vrati prazno za aktivnosti, pokušaj import specifičan za aktivnosti
    if (!resAktivnosti || resAktivnosti.count === 0) {
      await importAktivnostiFromApi(query);
      resAktivnosti = await searchAktivnostiInDb(query);
    }

    const aktivnostiData = resAktivnosti.data || [];

    // Mapiranje aktivnosti koristeći tvoj novi SearchAktivnost model
    const aktivnosti = aktivnostiData.map((a: any) => 
      new SearchAktivnost(
        a.id, 
        a.naziv, 
        a.cena, 
        a.trajanje, 
        a.opis, 
        a.slika || ""
      )
    );

    setSearchedAktivnosti(aktivnosti);

  } catch (e) {
    // Čak i ako ovde baci 500, hoteli iznad će ostati učitani
    console.error("Aktivnosti greška (Proveri Laravel logove):", e);
  }

};

  return (
    <div>
      <MenuBar onSearch={handleSearch} />
      
      {/* Prikazivanje na osnovu filtera */}
      {filter === 'hotels' && <HotelList />}
      {filter === 'restaurants' && <RestaurantList />}
      
      {/* DODATO: Prikaz liste aktivnosti */}
      {filter === 'aktivnosti' && <AktivnostList />}
      
      {filter === 'favorites' && <FavoritesList />}
      {/* Prikazuje se samo ako je ulogovan admin */}
     
     {filter === 'users' && user?.role === 'admin' && (
          <UsersList />
        )}
    </div>
  );
};

export default Home;