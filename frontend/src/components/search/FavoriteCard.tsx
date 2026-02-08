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
    <div className='flex items-center justify-center'>
      <div className='max-w-sm rounded-2xl overflow-hidden shadow-lg border border-gray-100'>
        <img
          src={favorite?.image || tripadvisorImg}
          className='w-full h-48 object-cover cursor-pointer'
          alt={favorite.name}
          onClick={() => navigate(favorite.link)}
        />
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2'>{favorite.name}</div>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <FaStar className="text-yellow-500" />
              <span>{favorite.rating}</span>
            </div>
          </span>
          <span className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <MdReviews className="text-blue-500" />
              <span>{favorite.reviews}</span>
            </div>
          </span>
          
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;