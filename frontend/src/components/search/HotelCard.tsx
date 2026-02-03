import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import tripadvisorImg from '../../assets/tripadvisor.png';
import { SearchHotel } from '../../models/Hotels';
import { getAveragePrice } from '../../models/Hotels';
import { useFavorites } from '../../hooks/useFavorites.hook';
import { Favorite } from '../../models/Favorites';

interface HotelCardProps {
  hotel: SearchHotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {

  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { favorites, setFavorites } = useFavorites();

  const handleFavorite = () => {
    let currentFavorites = favorites;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].link === `/hotels/${hotel.id}`) {
        currentFavorites = favorites.filter(
          (favorite) => favorite.link !== `/hotels/${hotel.id}`
        );
        setFavorites(currentFavorites);
        return;
      }
    }
    currentFavorites.push(
      new Favorite(
        hotel.id,
        hotel.name,
        hotel.rating,
        hotel.reviews,
        hotel.priceRange.min.toString(),
        hotel.image,
        `/hotels/${hotel.id}`
      )
    );
    setFavorites(currentFavorites);
  };

  useEffect(() => {
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].link === `/hotels/${hotel.id}`) {
        setIsFavorite(true);
        return;
      }
    }
    setIsFavorite(false);
  }, [favorites]);


  return (
    <div className='flex items-center justify-center '>
      {favorites && <></>}
      <div className='max-w-sm rounded-2xl overflow-hidden shadow-lg'>
        <img
          src={hotel?.image || tripadvisorImg}
          className='w-full cursor-pointer'
          alt='tripadvisorhotel'
          onClick={() => navigate(`/hotels/${hotel.id}`)}
        />
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2'>{hotel.name}</div>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <FaStar />
              <span>{hotel.rating}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <MdReviews />
              <span>{hotel.reviews}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <RiMoneyDollarCircleFill />
              <span>{getAveragePrice(hotel.priceRange)}</span>
            </div>
          </span>
          <span
            onClick={handleFavorite}
            className='inline-block bg-gray-200 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer'
          >
            <div className='flex items-center'>
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;