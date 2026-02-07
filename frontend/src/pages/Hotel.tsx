import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import tripadvisorImg from '../assets/tripadvisor.png';
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';
import axios from 'axios'; // Koristimo direktno ili tvoj utils
import { HotelDetails } from '../models/Hotels';

const Hotel = () => {
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();

  useEffect(() => {
    const fetchHotelDetails = async (idStr: string) => {
      setLoading(true);
      try {
        // Pozivamo tvoj API (možeš koristiti i funkciju iz utils-a)
        const response = await axios.get(`http://localhost:8000/api/places/${idStr}`);
        const hotelRes = response.data;

        if (hotelRes) {
          setHotel(
            new HotelDetails(
              hotelRes.id,
              hotelRes.name || hotelRes.ime,
              hotelRes.rating,
              hotelRes.reviews,
              hotelRes.slika, // SLIKA JE OVDE 5. ARGUMENT (kao u tvom HotelDetails modelu)
              hotelRes.email,
              hotelRes.link,
              hotelRes.website,
              hotelRes.address || hotelRes.adresa,
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

    if (id) {
      fetchHotelDetails(id);
    }
  }, [id, setLoading]);

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
          No hotel data! Check your API!
        </h1>
      )}
      
      <h1 className='font-extrabold text-center text-5xl mt-24'>
        {hotel?.name}
      </h1>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 mt-10'>
        <div className='flex items-center justify-center p-2'>
          {/* PRIKAZ SLIKE */}
          <img
            src={hotel?.image || tripadvisorImg}
            alt={'hotel ' + hotel?.name}
            className='rounded-md w-full max-w-2xl object-cover'
          />
        </div>

        <div className='p-2'>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Address:</span> {hotel?.address || 'N/A'}
          </p>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Rating:</span> {hotel?.rating || 'N/A'} 
          </p>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Reviews:</span> {hotel?.reviews || '0'}
          </p>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Phone:</span> {hotel?.phone || 'N/A'}
          </p>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Website:</span>{' '}
            {hotel?.website ? (
              <a href={hotel.website} target='_blank' rel='noreferrer' className="text-blue-500 underline">
                Official Website
              </a>
            ) : 'N/A'}
          </p>
          <p className='text-2xl py-2'>
            <span className='font-bold'>TripAdvisor:</span>{' '}
            {hotel?.link ? (
              <a href={hotel.link} target='_blank' rel='noreferrer' className="text-green-600 underline">
                View on TripAdvisor
              </a>
            ) : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hotel;