import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

import tripadvisorImg from '../../assets/tripadvisor.png';
import { Favorite } from '../../models/Favorites';

interface FavoriteCardProps {
  favorite: Favorite;
}

const FavoriteCard = ({ favorite }: FavoriteCardProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center '>
      <div className='max-w-sm rounded-2xl overflow-hidden shadow-lg'>
        <img
          src={favorite?.image || tripadvisorImg}
          className='w-full cursor-pointer'
          alt='tripadvisorrestaurant'
          onClick={() => navigate(favorite.link)}
        />
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2'>{favorite.name}</div>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <FaStar />
              <span>{favorite.rating}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <MdReviews />
              <span>{favorite.reviews}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <RiMoneyDollarCircleFill />
              <span>{favorite.priceRange || '$'}</span>
            </div>
          </span>
          {/* <span
        onClick={handleFavorite}
        className='inline-block bg-gray-200 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 mr-2 mb-2 cursor-pointer'
      >
        <div className='flex items-center'>
          {favorites.includes(possibleFavorite) ? (
            <FaHeart />
          ) : (
            <FaRegHeart />
          )}
        </div>
      </span> */}
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;