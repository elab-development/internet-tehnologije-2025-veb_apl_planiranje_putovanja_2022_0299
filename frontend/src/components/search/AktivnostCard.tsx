import { useNavigate } from 'react-router-dom';
import { IoMdTime } from 'react-icons/io';
import { MdOutlineDescription } from 'react-icons/md';
import { RiMoneyEuroCircleFill } from 'react-icons/ri';

import tripadvisorImg from '../../assets/tripadvisor.png';
import { SearchAktivnost } from '../../models/Aktivnost';

interface AktivnostCardProps {
  aktivnost: SearchAktivnost;
}

const AktivnostCard = ({ aktivnost }: AktivnostCardProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center p-4'>
      <div className='max-w-sm w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-transform hover:scale-105'>
        <img
          src={aktivnost?.image || tripadvisorImg}
          className='w-full h-48 object-cover cursor-pointer'
          alt={aktivnost.naziv}
          // Navigacija na rutu detalja aktivnosti koju si napravila
          onClick={() => navigate(`/aktivnost/${aktivnost.id}`)}
        />
        
        <div className='px-6 py-4'>
          {/* Naziv aktivnosti iz baze */}
          <div className='font-bold text-xl mb-2 truncate'>{aktivnost.naziv}</div>
          
          {/* Kratak opis/tip atrakcije */}
          <p className='text-gray-600 text-sm flex items-center gap-1 mb-2'>
            <MdOutlineDescription className='text-gray-400' />
            <span className='truncate'>{aktivnost.opis}</span>
          </p>
        </div>

        <div className='px-6 pt-2 pb-4'>
          {/* Trajanje (npr. 2-4 h) */}
          <span className='inline-block bg-blue-50 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <IoMdTime className="text-blue-500" />
              <span>{aktivnost.trajanje}</span>
            </div>
          </span>

          {/* Cena (decimal iz baze + EUR) */}
          <span className='inline-block bg-green-50 rounded-full px-3 py-1 text-sm font-semibold text-green-700 mr-2 mb-2'>
            <div className='flex items-center gap-1'>
              <RiMoneyEuroCircleFill className="text-green-600" />
              <span>{aktivnost.cena} EUR</span>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AktivnostCard;