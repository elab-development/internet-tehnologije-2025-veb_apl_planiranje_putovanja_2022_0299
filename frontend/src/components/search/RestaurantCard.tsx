import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { useFavorites } from '../../hooks/useFavorites.hook';
import { Favorite } from '../../models/Favorites';

import tripadvisorImg from '../../assets/tripadvisor.png';
import { SearchRestaurant } from '../../models/Restaurant';

interface RestaurantCardProps {
  restaurant: SearchRestaurant;
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { favorites, setFavorites } = useFavorites();

  const handleFavorite = () => {
    let currentFavorites = favorites;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].link === `/restaurants/${restaurant.id}`) {
        currentFavorites = favorites.filter(
          (favorite) => favorite.link !== `/restaurants/${restaurant.id}`
        );
        setFavorites(currentFavorites);
        return;
      }
    }
    currentFavorites.push(
      new Favorite(
        restaurant.id,
        restaurant.name,
        restaurant.rating,
        restaurant.reviews,
        restaurant.priceRange,
        restaurant.image,
        `/restaurants/${restaurant.id}`
      )
    );
    setFavorites(currentFavorites);
  };

  useEffect(() => {
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].link === `/restaurants/${restaurant.id}`) {
        setIsFavorite(true);
        return;
      }
    }
    setIsFavorite(false);
  }, [favorites]);
  return (
    <div className='flex items-center justify-center '>
      <div className='max-w-sm rounded-2x1 overflow-hidden shadow-lg'>
        <img
          src={restaurant?.image || tripadvisorImg}
          className='w-full cursor-pointer'
          alt='tripadvisorrestaurant'
          onClick={() => navigate(`/restaurants/${restaurant.id}`)}
        />
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2'>{restaurant.name}</div>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <FaStar />
              <span>{restaurant.rating}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <MdReviews />
              <span>{restaurant.reviews}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <RiMoneyDollarCircleFill />
              <span>{restaurant.priceRange || '$'}</span>
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

export default RestaurantCard;