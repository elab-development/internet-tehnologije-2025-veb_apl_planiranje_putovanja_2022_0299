import { Link } from 'react-router-dom';
import logo from '../assets/logo2.svg';
import { useLoggedIn } from '../hooks/useLoggedIn';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [user, setUser] = useState('');
  const { loggedIn } = useLoggedIn();

  useEffect(() => {
    let storage = localStorage.getItem('user');
    if (storage) {
      setUser(storage);
    }
  }, [loggedIn]);

  return (
      <div className='flex py-4 pl-20 justify-between navbar'>
      <Link to={'/'} className='flex items-center gap-2'>
        <img src={logo} className='w-10 h-10 bg-green-400 rounded-full' />
        <h1 className='font-bold text-2xl'>Tripadvisor</h1>
      </Link>
      <div className='flex justify-end gap-10 mr-20'>
        {user && (
          <h1 className='font-semibold mt-2'>
            Welcome, <span className='text-green-500'>{user}</span> !
          </h1>
        )}
        {loggedIn && (
          <Link to={'/login'}>
            <h1 className='font-semibold mt-2'>Logout</h1>
          </Link>
        )}
      </div>
      </div>
  );
};

export default Navbar;