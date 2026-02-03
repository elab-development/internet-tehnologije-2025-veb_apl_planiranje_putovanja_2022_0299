import { createContext, ReactNode, useState } from 'react';
import { SearchHotel } from '../models/Hotels';
import { SearchRestaurant } from '../models/Restaurant';
import { Favorite } from '../models/Favorites';

interface GlobalContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  searchedHotels: SearchHotel[];
  setSearchedHotels: React.Dispatch<React.SetStateAction<SearchHotel[]>>;
  searchedRestaurants: SearchRestaurant[];
  setSearchedRestaurants: React.Dispatch<
    React.SetStateAction<SearchRestaurant[]>
  >;
  loggedIn: boolean;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('hotels');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchedHotels, setSearchedHotels] = useState<SearchHotel[]>([]);
   const [searchedRestaurants, setSearchedRestaurants] = useState<
  SearchRestaurant[]
>([]);
const [favorites, setFavorites] = useState<Favorite[]>([]); 
const [loggedIn, setLoggedIn] = useState(false);


  return (
    <GlobalContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        loading,
        setLoading,
        searchedHotels,
        setSearchedHotels,
        searchedRestaurants,
        setSearchedRestaurants,
        loggedIn,
        setLoggedIn,
        favorites,
        setFavorites,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;