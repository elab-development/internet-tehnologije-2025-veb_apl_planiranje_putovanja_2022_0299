import { useContext } from 'react';
import GlobalContext from '../context/ContextProvider';

export const useLoggedIn = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('There is a problem with ContextProvider!');
  }
  const { loggedIn, setLoggedIn } = context;
  return { loggedIn, setLoggedIn };
};