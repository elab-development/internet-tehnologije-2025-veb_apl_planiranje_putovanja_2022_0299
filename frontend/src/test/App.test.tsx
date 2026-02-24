import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi, describe } from 'vitest';
import Navbar from '../components/Navbar';
import { ContextProvider } from '../context/ContextProvider';

vi.mock('../hooks/useLoggedIn', () => {
  const mockValue = {
    loggedIn: false,
    setLoggedIn: vi.fn(),
  };
  return {
    default: mockValue,
    useLoggedIn: () => mockValue, 
  };
});

describe('Navbar component', () => {
  test('renders the logo and links', () => {
    render(
      <ContextProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </ContextProvider>
    );

    
    const logoLink = screen.getByRole('link', { name: /.*/ }); 
    expect(logoLink.getAttribute('href')).toBe('/');
  });
});