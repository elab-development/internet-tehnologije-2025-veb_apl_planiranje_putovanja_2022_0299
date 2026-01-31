import { FaHotel } from 'react-icons/fa';
import { MdRestaurantMenu } from 'react-icons/md';
import FilterItem from './FilterItem';
import { useSearchTerm } from '../../hooks/useSearchTerm.hook';
import { useState } from 'react';

const MenuBar = () => {
  const { searchTerm, setSearchTerm } = useSearchTerm();
  const [inputSearch, setInputSearch] = useState(searchTerm);

  const handleSearch = () => {
    setSearchTerm(inputSearch);
  };

  return (
    <>
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