import { useLoading } from '../../hooks/useLoading';
import { useSearchedRestaurants } from '../../hooks/useSearchedRestaurants';
import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import Loader from '../Loader';
import RestaurantCard from './RestaurantCard';

const RestaurantList = () => {
  return <div>RestaurantList</div>;
  const { searchedRestaurants } = useSearchedRestaurants();
  const { searchTerm } = useSearchTerm();
  const { loading } = useLoading();

  if (loading) {
    return (
      <div className='flex justify-center mt-20'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {searchTerm
        ? searchedRestaurants.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                No results found! Try something else
              </h2>
            </div>
          )
        : searchedRestaurants.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                Enter your destination and press Search!
              </h2>
            </div>
          )}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-5 mb-5'>
        {searchedRestaurants?.map((restaurant, idx) => (
          <RestaurantCard key={idx} restaurant={restaurant} />
        ))}
      </div>
    </>
  );};

export default RestaurantList;