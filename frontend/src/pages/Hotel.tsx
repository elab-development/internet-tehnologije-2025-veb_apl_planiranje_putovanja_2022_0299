import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import tripadvisorImg from '../assets/tripadvisor.png';
import { getHotelDetails } from '../utils/hotelsApi';
import { HotelDetails } from '../models/Hotels';
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';

const Hotel = () => {
    return <div></div>;
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();

  useEffect(() => {
    const fetchHotelDetails = async (idStr: string) => {
      setLoading(true);
      try {
        const hotelRes = await getHotelDetails(idStr);
        if (hotelRes) {
          setHotel(
            new HotelDetails(
              hotelRes.id,
              hotelRes.name,
              hotelRes.rating,
              hotelRes.reviews,
              hotelRes.featured_image,
              hotelRes.email,
              hotelRes.link,
              hotelRes.website,
              hotelRes.address,
              hotelRes.phone
            )
          );
        }
      } catch (error) {
        console.error(error);
        setHotel(null);
      }

      setLoading(false);
    };

    if (id?.toString()) {
      fetchHotelDetails(id?.toString());
    }
  }, [id]);

  if (loading) {
    return (
      <div className='flex justify-center mt-24'>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {!hotel && (
        <h1 className='font-extrabold text-center text-5xl mt-24'>
          No hotel data! Check you API!
        </h1>
      )}
      <h1 className='font-extrabold text-center text-5xl mt-24'>
        {hotel?.name}
      </h1>
      <div className='grid sm:grid-cols-1 md:grid-cols-2 mt-10'>
        <div className='flex items-center justify-center p-2'>
          <img
            src={hotel?.image || tripadvisorImg}
            alt={'hotel' + hotel?.name}
            className='rounded-md'
          />
        </div>
        <div className='p-2'>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Address:</span>{' '}
            {hotel?.address || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Phone:</span> {hotel?.phone || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Rating:</span> {hotel?.rating || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Reviews:</span>{' '}
            {hotel?.reviews || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Link:</span>{' '}
            {hotel?.link ? (
              <a href={hotel?.link} rel='norefferer' target='_blank'>
                TripAdvisor
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Website:</span>{' '}
            {hotel?.website ? (
              <a href={hotel?.website} rel='norefferer' target='_blank'>
                {hotel?.name}
              </a>
            ) : (
              'N/A'
            )}
          </p>
        </div>
      </div>
    </div>
  );
  };

  export default Hotel;