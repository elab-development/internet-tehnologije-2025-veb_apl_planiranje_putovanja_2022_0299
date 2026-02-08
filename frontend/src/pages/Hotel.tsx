import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import tripadvisorImg from '../assets/tripadvisor.png';
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';
import axios from 'axios';
import { HotelDetails } from '../models/Hotels';

const Hotel = () => {
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();
  
  const location = useLocation();
  const imageFromState = location.state?.imageFromList;

  useEffect(() => {
    const fetchHotelDetails = async (idStr: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/places/${idStr}`);
        
        // REŠENJE 1: Provera da li Laravel šalje podatke u "data" objektu
        const res = response.data.data ? response.data.data : response.data;
        
        console.log("Čist objekat za mapiranje:", res);

        if (res) {
          // REŠENJE 2: Precizno mapiranje po redosledu tvog konstruktora (9 parametara)
          const mappedHotel = new HotelDetails(
            res.id,                                     // 1. id
            res.name || res.ime || "Nepoznato",         // 2. name
            Number(res.rating || res.prosecna_ocena || 0), // 3. rating
            Number(res.reviews || res.broj_recenzija || 0),// 4. reviews
            res.image || res.slika || "",               // 5. image
            res.email || "",                            // 6. email
            res.link || res.tripadvisor_link || "",     // 7. link
            res.website || res.sajt || "",              // 8. website
            res.address || res.adresa || "Nije dostupna" // 9. address
          );

          setHotel(mappedHotel);
        }
      } catch (error) {
        console.error("Greška pri učitavanju:", error);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHotelDetails(id);
  }, [id, setLoading]);

  if (loading) return <div className='flex justify-center mt-24'><Loader /></div>;

  const finalImage = imageFromState || hotel?.image || tripadvisorImg;

  return (
    <div className="container mx-auto px-4">
      {!hotel && !loading && (
        <h1 className='font-extrabold text-center text-3xl mt-24 text-red-600'>
          Podaci o hotelu nisu pronađeni!
        </h1>
      )}
      
      {hotel && (
        <>
          <h1 className='font-extrabold text-center text-4xl md:text-5xl mt-12 md:mt-24 uppercase'>
            {hotel.name}
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 mb-20'>
            <div className='flex items-center justify-center'>
              <img
                src={finalImage}
                alt={hotel.name}
                className='rounded-2xl w-full max-w-2xl h-[400px] object-cover shadow-2xl'
              />
            </div>

            <div className='flex flex-col justify-center space-y-6'>
              {/* ADRESA */}
              <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm'>
                <p className='text-2xl'>
                  <span className='font-bold text-gray-700'>Adresa:</span> 
                  <br /> 
                  <span className='text-gray-600'>{hotel.address}</span>
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center shadow-sm'>
                  <p className='text-sm text-yellow-600 font-bold uppercase'>Ocena</p>
                  <p className='text-3xl font-black'>⭐ {Number(hotel.rating).toFixed(1)}</p>
                </div>

                <div className='bg-blue-50 p-4 rounded-xl border border-blue-100 text-center shadow-sm'>
                  <p className='text-sm text-blue-600 font-bold uppercase'>Recenzije</p>
                  <p className='text-3xl font-black'>💬 {hotel.reviews}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {hotel.website && (
                  <a href={hotel.website} target='_blank' rel='noreferrer' 
                     className="bg-gray-800 text-white text-center py-3 rounded-lg font-bold hover:bg-gray-700 transition-all">
                    Poseti zvanični sajt
                  </a>
                )}
                {hotel.link && (
                  <a href={hotel.link} target='_blank' rel='noreferrer' 
                     className="bg-green-600 text-white text-center py-3 rounded-lg font-bold hover:bg-green-500 transition-all">
                    Pogledaj na TripAdvisor-u
                  </a>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Hotel;