import { useFilter } from '../hooks/useFilter.hook';
import MenuBar from '../components/home/MenuBar';
import HotelList from '../components/search/HotelList';
import RestaurantList from '../components/search/RestaurantList';
import { useSearchedHotels } from '../hooks/useSearchedHotels';
import { useSearchedRestaurants } from '../hooks/useSearchedRestaurants';
import { searchPlacesInDb, importFromApi } from '../utils/hotelsApi';
import { SearchHotel } from '../models/Hotels';
import { SearchRestaurant } from '../models/Restaurant';

const Home = () => {
  const { filter } = useFilter();
  const { setSearchedHotels } = useSearchedHotels();
  const { setSearchedRestaurants } = useSearchedRestaurants();

  const handleSearch = async (query: string) => {
    try {
      let res = await searchPlacesInDb(query);
      
      if (res.count === 0) {
        await importFromApi(query);
        res = await searchPlacesInDb(query);
      }

    
      const hotels = res.data
        .filter((i: any) => i.tip === 'hotel')
        .map((h: any) => new SearchHotel(h.id, h.ime, h.prosecna_ocena, h.broj_recenzija, {min:0, max:0}, h.slika || ""));
      
      const restaurants = res.data
        .filter((i: any) => i.tip === 'restoran')
        .map((r: any) => new SearchRestaurant(r.id, r.ime, r.prosecna_ocena, r.broj_recenzija, "$$", r.slika || ""));

      setSearchedHotels(hotels);
      setSearchedRestaurants(restaurants);
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <MenuBar onSearch={handleSearch} />
      {filter === 'hotels' && <HotelList />}
      {filter === 'restaurants' && <RestaurantList />}
    </div>
  );
};

export default Home;