import { Link } from 'react-router-dom';
import logo from '../assets/logo2.png';

const Navbar = () => {
  return (
      <div className='flex pt-4 pl-20 justify-between'>
      <Link to={'/'} className='flex items-center gap-2'>
        <img src={logo} className='w-10 h-10 bg-green-400 rounded-full' />
        <h1 className='font-bold text-2xl'>Tripadvisor</h1>
      </Link>
      <div className='flex justify-end gap-10 mr-20'>
        <Link to={'/'}>
          <h1 className='font-semibold mt-2'>Discover</h1>
        </Link>
        <Link to={'/login'}>
          <h1 className='font-semibold mt-2'>Login</h1>
       </Link>
      </div>
      </div>
  );
};

export default Navbar;