import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import tripadvisorImg from '../assets/tripadvisor.png';
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';
import { FaClock, FaMoneyBillWave } from 'react-icons/fa';

// Uvoz funkcije iz tvog API fajla
import { getAktivnostDetails } from '../utils/AktivnostApi'; 

// Uvoz modela - pazi na naziv fajla (Activities ili Aktivnosti)
import { AktivnostDetails } from '../models/Aktivnost';

const Aktivnost = () => {
  const [activity, setActivity] = useState<AktivnostDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();
  
  // Hvatanje slike prosleđene iz ActivityCard-a
  const location = useLocation();
  const imageFromState = location.state?.imageFromList;

  useEffect(() => {
    const fetchDetails = async (idStr: string) => {
      setLoading(true);
      try {
        // Poziv tvoje funkcije koju si mi poslao iz API-ja
        const data = await getAktivnostDetails(idStr);

        if (data) {
          // Pravimo novu instancu tvoje klase AktivnostDetails
          // Redosled: id, naziv, cena, trajanje, opis, image, destinacija_id
            setActivity(new AktivnostDetails(
              data.id,
              data.naziv,
              data.cena,
              data.trajanje,
              data.opis,
              data.image,
              data.destinacija_id
));
         

        }
      } catch (error) {
        console.error("Greška pri učitavanju detalja:", error);
      }
      setLoading(false);
    };

    if (id) fetchDetails(id);
  }, [id, setLoading]);

  if (loading) return <div className='flex justify-center mt-24'><Loader /></div>;

  // Logika za sliku: state > baza > placeholder
  const finalImage = imageFromState || activity?.image || tripadvisorImg;

  return (
    <div className="container mx-auto px-4">
      {activity && (
        <>
          <h1 className='font-extrabold text-center text-4xl md:text-5xl mt-12 md:mt-24 uppercase'>
            {activity.naziv}
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-10 mt-10 mb-20'>
            {/* Sekcija sa slikom */}
            <div className='flex items-center justify-center'>
              <img
                src={finalImage}
                alt={activity.naziv}
                className='rounded-2xl w-full max-w-2xl h-[350px] md:h-[500px] object-cover shadow-2xl'
              />
            </div>

            {/* Detalji: NEMA OCENA I REVIEWS - SAMO TRAJANJE I CENA */}
            <div className='flex flex-col justify-center space-y-6'>
              <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100'>
                <h3 className='text-xl font-bold mb-2 text-gray-800 uppercase'>Opis</h3>
                <p className='text-gray-600 text-lg italic leading-relaxed'>
                  {activity.opis}
                </p>
              </div>

              <div className='flex flex-col gap-4'>
                {/* TRAJANJE */}
                <div className='flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100'>
                  <FaClock className='text-blue-600 text-2xl' />
                  <div>
                    <p className='text-xs text-blue-500 font-bold uppercase'>Trajanje</p>
                    <p className='text-xl font-black text-blue-900'>{activity.trajanje}</p>
                  </div>
                </div>

                {/* CENA */}
                <div className='flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100'>
                  <FaMoneyBillWave className='text-green-600 text-2xl' />
                  <div>
                    <p className='text-xs text-green-500 font-bold uppercase'>Cena</p>
                    <p className='text-xl font-black text-green-900'>{activity.cena} RSD</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button className='w-full md:w-auto bg-green-500 text-white px-12 py-4 rounded-full font-extrabold hover:bg-green-600 transition-all shadow-lg uppercase'>
                  Rezerviši termin
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Aktivnost;