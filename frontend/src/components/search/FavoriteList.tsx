import { useFavorites } from '../../hooks/useFavorites.hook';
import FavoriteCard from './FavoriteCard';

const FavoritesList = () => {
  const { favorites } = useFavorites();

  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-5 mb-5'>
      {favorites.map((favorite, idx) => (
        <FavoriteCard key={idx} favorite={favorite} />
      ))}
    </div>
  );
};

export default FavoritesList;