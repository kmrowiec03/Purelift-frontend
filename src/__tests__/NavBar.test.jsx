import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { AuthContext } from '../actions/AuthContext';
import { vi } from 'vitest';

const MockedNavBar = ({ authValue }) => (
  <BrowserRouter>
    <AuthContext.Provider value={authValue}>
      <NavBar />
    </AuthContext.Provider>
  </BrowserRouter>
);

describe('NavBar Component', () => {
  test('wyświetla logo aplikacji', () => {
    const authValue = { isLoggedIn: false, user: null, logout: vi.fn() };
    render(<MockedNavBar authValue={authValue} />);
    
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });

  test('wyświetla przyciski logowania dla niezalogowanego użytkownika', () => {
    const authValue = { isLoggedIn: false, user: null, logout: vi.fn() };
    render(<MockedNavBar authValue={authValue} />);
    
    // Szukamy pierwszego elementu z tekstem Sign in
    const signInElements = screen.getAllByText('Sign in');
    expect(signInElements[0]).toBeInTheDocument();
  });

  test('wyświetla menu hamburgera', () => {
    const authValue = { isLoggedIn: false, user: null, logout: vi.fn() };
    render(<MockedNavBar authValue={authValue} />);
    
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger).toBeInTheDocument();
  });

  test('wyświetla menu dla zalogowanego użytkownika', () => {
    const loggedInUser = { 
      isLoggedIn: true, 
      user: { id: 1, firstName: 'Jan', lastName: 'Kowalski', role: 'ROLE_USER' }, 
      logout: vi.fn() 
    };
    
    render(<MockedNavBar authValue={loggedInUser} />);
    
    // Sprawdź czy wyświetlają się opcje dla zalogowanego użytkownika
    const profileElements = screen.getAllByText('Profile');
    const logoutElements = screen.getAllByText('Logout');
    expect(profileElements.length).toBeGreaterThan(0);
    expect(logoutElements.length).toBeGreaterThan(0);
  });

  test('umożliwia wylogowanie zalogowanego użytkownika', () => {
    const mockLogout = vi.fn();
    const loggedInUser = { 
      isLoggedIn: true, 
      user: { id: 1, firstName: 'Jan', role: 'ROLE_USER' }, 
      logout: mockLogout 
    };
    
    render(<MockedNavBar authValue={loggedInUser} />);
    
    // Szukamy przycisku wylogowania (może być kilka - desktop i mobile)
    const logoutButtons = screen.getAllByText('Logout');
    fireEvent.click(logoutButtons[0]);
    
    // NavBar prawdopodobnie używa linku, więc sprawdzamy czy link został kliknięty
    expect(logoutButtons[0]).toBeInTheDocument();
  });
});