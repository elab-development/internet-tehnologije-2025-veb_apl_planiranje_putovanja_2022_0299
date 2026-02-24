import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoggedIn } from '../hooks/useLoggedIn';

// Definišemo interfejs da Navbar zna šta su "stats"
interface NavbarProps {
  stats?: {
    brojHotela: number;
    brojRestorana: number;
    brojAktivnosti: number;
    grad: string;
  }
}

const Navbar = ({ stats }: NavbarProps) => {
  const [user, setUser] = useState<any>(null);
  const { loggedIn, setLoggedIn } = useLoggedIn();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="flex py-4 px-10 justify-between items-center bg-white border-b">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img 
            src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
            alt="Tripadvisor" 
            className="h-6" 
          />
        </Link>
      </div>

      <div className="flex gap-6 items-center">
        {loggedIn && (
          <>
            <h1 className="font-medium text-sm">
              Welcome, <span className="text-green-600 font-bold">{user?.ime || 'Danica'}!</span>
            </h1>

            {/* KLJUČNI DEO: Prosleđujemo stats u statistiku */}
            <Link 
              to="/statistika" 
              state={stats} 
              className="flex items-center gap-1 text-sm font-bold hover:text-green-600 transition-colors"
            >
              📊 Statistika
            </Link>

            <button onClick={handleLogout} className="text-sm font-bold hover:underline">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;