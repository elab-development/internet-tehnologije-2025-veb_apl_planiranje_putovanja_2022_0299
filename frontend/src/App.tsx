import { useState } from 'react'
import reactLogo from './assets/logo2.svg'
import viteLogo from '/logo.png'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotel from './pages/Hotel';
import Restaurant from './pages/Restaurant';
import Navbar from './components/Navbar';
import { useLoggedIn } from './hooks/useLoggedIn';

function App() {
  const { loggedIn } = useLoggedIn();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={loggedIn ? <Home /> : <Navigate to={'/login'} />}
        />
        <Route
          path='/login'
          element={!loggedIn ? <Login /> : <Navigate to={'/'} />}
        />
        <Route
          path='/register'
          element={!loggedIn ? <Register /> : <Navigate to={'/'} />}
        />
        <Route
          path='/hotels/:id'
          element={loggedIn ? <Hotel /> : <Navigate to={'/login'} />}
        />
        <Route
          path='/restaurants/:id'
          element={loggedIn ? <Restaurant /> : <Navigate to={'/login'} />}
        />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App