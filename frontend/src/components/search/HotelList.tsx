import { useLoading } from '../../hooks/useLoading';
import { useSearchedHotels } from '../../hooks/useSearchedHotels';
import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import Loader from '../Loader';
import HotelCard from './HotelCard';

const HotelList = () => {
  const { searchedHotels } = useSearchedHotels();
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
        ? searchedHotels.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                No results found! Try something else
              </h2>
            </div>
          )
        : searchedHotels.length === 0 && (
            <div className='flex justify-center mt-10'>
              <h2 className='text-3xl font-bold'>
                Enter your destination and press Search!
              </h2>
            </div>
          )}
      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-5 mb-5'>
         {searchedHotels?.map((hotel, idx) => (
          <HotelCard key={idx} hotel={hotel} />
        ))}
      </div>
    </>
  );
};

export default HotelList;