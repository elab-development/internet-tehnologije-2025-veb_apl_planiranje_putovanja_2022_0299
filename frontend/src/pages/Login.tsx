import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLoggedIn } from '../hooks/useLoggedIn';

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setLoggedIn } = useLoggedIn();

  const handleLogin = async () => {
    setError('');

    if (!email) { setError('Provide Email!'); return; }
    if (!password) { setError('Provide Password!'); return; }

    try {
      
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      //  localStorage.setItem('user', email); 
      const messageFromServer = response.data.message;
      const nameOnly = messageFromServer.split(' ')[0]; 

      localStorage.setItem('user', nameOnly);
        
        setLoggedIn(true);
        navigate('/');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError('Wrong email or password!');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-green-600'>
      <div className='w-96 p-6 shadow-lg bg-white rounded-md'>
        <h1 className='text-3xl block text-center font-semibold'>
          Login
        </h1>
        <hr className='mt-3' />
        
        <div className='mt-3'>
          <label className='block text-base mb-2'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border w-full rounded-md text-base px-2 py-1 focus:outline-none'
            placeholder='Enter Email...'
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
          <div className='mt-4 text-red-600 flex justify-center font-bold text-sm text-center'>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;