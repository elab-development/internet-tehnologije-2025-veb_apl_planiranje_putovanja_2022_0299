import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoggedIn } from '../hooks/useLoggedIn';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setLoggedIn } = useLoggedIn();

  const handleLogin = () => {
    setError('');

    if (!username) {
      setError('Provide Username!');
      return;
    }

    if (!email) {
      setError('Provide Email!');
      return;
    }

    if (!password) {
      setError('Provide Password!');
      return;
    }

    localStorage.setItem('user', username);
    setLoggedIn(true);
    navigate('/');
  };

  return (
    <div className='flex justify-center items-center h-screen bg-green-500'>
      <div className='w-96 p-6 shadow-lg bg-white rounded-md'>
        <h1 className='text-3xl block text-center font-semibold'>
          <i className='fa-solid fa-user'></i> Register
        </h1>
        <hr className='mt-3' />
        <div className='mt-3'>
          <label className='block text-base mb-2'>Username</label>
          <input
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='border w-full rounded-md text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600'
            placeholder='Enter Username...'
          />
        </div>
        <div className='mt-3'>
          <label className='block text-base mb-2'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border w-full rounded-md text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600'
            placeholder='Enter Email...'
          />
        </div>
        <div className='mt-3'>
          <label className='block text-base mb-2'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border rounded-md w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600'
            placeholder='Enter Password...'
          />
        </div>

        <div className='mt-5'>
          <button
            type='button'
            onClick={handleLogin}
            className='border-2 border-green-500 bg-green-500 text-white py-1 w-full rounded-md hover:bg-transparent hover:text-green-500 font-semibold'
          >
            Register
          </button>
        </div>
        <div className='flex justify-center mt-2'>
          <Link to='/login' className='text-green-500 font-semibold'>
            Already have an account? Login here
          </Link>
        </div>

        {error && (
          <div className='mt-4 text-red-600 flex justify-center font-bold text-lg'>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;