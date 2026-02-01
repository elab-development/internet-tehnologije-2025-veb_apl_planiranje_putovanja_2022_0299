import { useState } from 'react';
import { FaHotel } from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';
import FilterItem from './FilterItem';
import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import { useSearchedHotels } from '../../hooks/useSearchedHotels';
import { useSearchedRestaurants } from '../../hooks/useSearchedRestaurants';
import { searchRestaurants } from '../../utils/restaurantsApi';
import { useLoading } from '../../hooks/useLoading';
import { searchHotels } from '../../utils/hotelsApi';
import { SearchHotel } from '../../models/Hotels';
import { SearchRestaurant } from '../../models/Restaurant';

const MenuBar = () => {
  const { searchTerm, setSearchTerm } = useSearchTerm();
  const { setSearchedHotels } = useSearchedHotels();
  const { setSearchedRestaurants } = useSearchedRestaurants();
  const { setLoading } = useLoading();
  const [inputSearch, setInputSearch] = useState(searchTerm);


    const fetchHotels = async () => {
    try {
      const hotelsResponse = await searchHotels(inputSearch);
      let newHotels: SearchHotel[] = [];
      hotelsResponse.results.forEach((result: any) => {
        newHotels.push(
          new SearchHotel(
            result.id,
            result.name,
            result.rating,
            result.reviews,
            {
              min: result.price_range_usd.min,
              max: result.price_range_usd.max,
             },
            result.featured_image
          )
        );
      });
      setSearchedHotels(newHotels);
    } catch (error) {
      setSearchedHotels([]);
    }
    };

  const fetchRestaurants = async () => {
    try {
      const restaurantsResponse = await searchRestaurants(inputSearch);
      let newRestaurants: SearchRestaurant[] = [];
      restaurantsResponse.results.forEach((result: any) => {
        newRestaurants.push(
          new SearchRestaurant(
            result.id,
            result.name,
            result.rating,
            result.reviews,
            result.price_range_usd,
            result.featured_image
          )
        );
      });
      setSearchedRestaurants(newRestaurants);
    } catch (error) {
      setSearchedRestaurants([]);
    }
  };

  const handleSearch = async () => { 
    setSearchTerm(inputSearch);
  
  if (inputSearch) {
    setLoading(true);
    await fetchHotels();
    await fetchRestaurants();
    setLoading(false);
  }
};

  return (
    <>
     <h1 className='font-extrabold text-center text-5xl mt-10'>Where to?</h1>
      <div className='flex justify-center p-10 gap-10'>
        <FilterItem name='hotels' icon={<FaHotel className='w-6 h-6' />} />
        <FilterItem
          name='restaurants'
          icon={<MdRestaurantMenu className='w-6 h-6' />}
        />
      </div>
      <div className='flex justify-center items-center'>
        <input
          className='w-1/2 bg-transparent border-2 border-r-0 border-slate-800 rounded-xl rounded-r-none py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-green-400'
          id='search'
          type='text'
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <button
          className='bg-green-400 font-semibold py-1.5 px-4 rounded-xl rounded-l-none border-slate-800 border-2
         hover:text-white hover:border-green-400'
          type='button'
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </>
  );
};

export default MenuBar;