import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { MdReviews } from 'react-icons/md';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

import tripadvisorImg from '../../assets/tripadvisor.png';
import { SearchHotel } from '../../models/Hotels';
import { getAveragePrice } from '../../models/Hotels';

interface HotelCardProps {
  hotel: SearchHotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center '>
      <div className='max-w-sm rounded overflow-hidden shadow-lg'>
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
        </div>
      </div>
    </div>
  );
};

export default HotelCard;