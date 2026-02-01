import { useFilter } from '../hooks/useFilter.hook';
import MenuBar from '../components/home/MenuBar';
import HotelList from '../components/search/HotelList';
import RestaurantList from '../components/search/RestaurantList';

const Home = () => {
   const { filter } = useFilter();
  return (
    <div>
      <MenuBar />
      {filter === 'hotels' && <HotelList />}
      {filter === 'restaurants' && <RestaurantList />}
    </div>
  );
  };
export default Home;