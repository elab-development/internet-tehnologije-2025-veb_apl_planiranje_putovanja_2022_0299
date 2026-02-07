import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import tripadvisorImg from '../assets/tripadvisor.png';
import { useLoading } from '../hooks/useLoading';
import Loader from '../components/Loader';
import { getRestaurantsDetails } from '../utils/restaurantsApi';
import { RestaurantDetails } from '../models/Restaurant';

const Restaurant = () => {
    const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
  const { loading, setLoading } = useLoading();
  const { id } = useParams();

  useEffect(() => {
    const fetchRestaurantDetails = async (idStr: string) => {
      setLoading(true);
      try {
        const restaurantRes = await getRestaurantsDetails(idStr);
        if (restaurantRes) {
          setRestaurant(
            new RestaurantDetails(
              restaurantRes.id,
              restaurantRes.name,
              restaurantRes.rating,
              restaurantRes.reviews,
              restaurantRes.price_range,
              restaurantRes.slika, // OVO JE DODATO
              restaurantRes.link,
              restaurantRes.address,
              restaurantRes.phone,
              restaurantRes.menu_link
            )
          );
        }
      } catch (error) {
        console.error(error);
        setRestaurant(null);
      }

      setLoading(false);
    };

    if (id?.toString()) {
      fetchRestaurantDetails(id?.toString());
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
      {!restaurant && (
        <h1 className='font-extrabold text-center text-5xl mt-24'>
          No restaurant data! Check you API!
        </h1>
      )}
      <h1 className='font-extrabold text-center text-5xl mt-24'>
        {restaurant?.name}
      </h1>
      <div className='grid sm:grid-cols-1 md:grid-cols-2 mt-10'>
        <div className='flex items-center justify-center p-2'>
          <img
            src={restaurant?.image || tripadvisorImg}
            alt={'restaurant' + restaurant?.name}
            className='rounded-md'
          />
        </div>
        <div className='p-2'>
          <p className='text-2xl py-2'>
            <span className='font-bold'>Address:</span>{' '}
            {restaurant?.address || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Phone:</span>{' '}
            {restaurant?.phone || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Rating:</span>{' '}
            {restaurant?.rating || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Reviews:</span>{' '}
            {restaurant?.reviews || 'N/A'}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Link:</span>{' '}
            {restaurant?.link ? (
              <a href={restaurant?.link} rel='norefferer' target='_blank'>
                TripAdvisor
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Menu:</span>{' '}
            {restaurant?.menu ? (
              <a href={restaurant?.menu} rel='norefferer' target='_blank'>
                {restaurant?.name}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p className='text-2xl  py-2'>
            <span className='font-bold'>Price:</span>{' '}
            {restaurant?.priceRange || '$ - $$'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;