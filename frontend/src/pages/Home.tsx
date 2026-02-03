import { useFilter } from '../hooks/useFilter.hook';
import MenuBar from '../components/home/MenuBar';
import HotelList from '../components/search/HotelList';
import RestaurantList from '../components/search/RestaurantList';
import FavoritesList from '../components/search/FavoriteList';

const Home = () => {
   const { filter } = useFilter();
  return (
    <div>
      <MenuBar />
      {filter === 'hotels' && <HotelList />}
      {filter === 'restaurants' && <RestaurantList />}
      {filter === 'favorites' && <FavoritesList />}
    </div>
  );
  };
export default Home;