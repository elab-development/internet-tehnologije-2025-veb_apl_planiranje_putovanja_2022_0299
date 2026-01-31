import { useState } from 'react'
import reactLogo from './assets/logo2.svg'
import viteLogo from '/logo.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Hotel from './pages/Hotel';
import Restaurant from './pages/Restaurant';
import Navbar from './components/Navbar';

function App() {
  

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hotels/:id' element={<Hotel />} />
        <Route path='/restaurants/:id' element={<Restaurant />} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App