import { createContext, ReactNode, useState } from 'react';
import { SearchHotel } from '../models/Hotels';
import { SearchRestaurant } from '../models/Restaurant';

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;