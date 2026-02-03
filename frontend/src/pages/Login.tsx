import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import tripadvisorLogo from '../assets/tripadvisor.png'; //

import { useLoggedIn } from '../hooks/useLoggedIn';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setLoggedIn } = useLoggedIn();

  const handleLogin = () => {
    setError('');
    if (!username) { setError('Provide Username!'); return; }
    if (!password) { setError('Provide Password!'); return; }

    localStorage.setItem('user', username);
    setLoggedIn(true);
    navigate('/');
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-green-600'>
      

      <div className='w-96 p-6 shadow-lg bg-white rounded-md'>
        <h1 className='text-3xl block text-center font-semibold'>
          Login
        </h1>
        <hr className='mt-3' />
        
        <div className='mt-3'>
          <label className='block text-base mb-2'>Username</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border w-full rounded-md text-base px-2 py-1 focus:outline-none'
            placeholder='Enter Username...'
          />
        </div>
        
        <div className='mt-3'>
          <label className='block text-base mb-2'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border rounded-md w-full text-base px-2 py-1 focus:outline-none'
            placeholder='Enter Password...'
          />
        </div>

        <div className='mt-3 flex justify-end items-center'>
          <a href='#' className='text-sm text-gray-500 hover:text-green-600'>
            Forgot Password?
          </a>
        </div>

        <div className='mt-5'>
          <button
            type='button'
            onClick={handleLogin}
            className='bg-green-600 text-white py-2 w-full rounded-md hover:bg-green-700 font-semibold transition-colors'
          >
            Login
          </button>
        </div>

        <div className='flex justify-center mt-4'>
          <Link to='/register' className='text-sm text-gray-600 hover:text-green-600'>
            Don't have an account? Register here
          </Link>
        </div>

        {error && (
          <div className='mt-4 text-red-600 flex justify-center font-bold text-sm'>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;