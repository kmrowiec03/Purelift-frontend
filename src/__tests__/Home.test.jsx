import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../components/Home';

describe('Home Component', () => {
  test('renderuje tytuł strony głównej', () => {
    render(<Home />);
    
    expect(screen.getByText('Zbuduj swój plan treningowy i śledź postępy')).toBeInTheDocument();
  });

  test('renderuje sekcję z korzyściami', () => {
    render(<Home />);
    
    expect(screen.getByText('Co oferujemy?')).toBeInTheDocument();
    expect(screen.getByText('Spersonalizowane plany treningowe')).toBeInTheDocument();
    expect(screen.getByText('Analiza postępów')).toBeInTheDocument();
    expect(screen.getByText('Tablica rekordów')).toBeInTheDocument();
  });

  test('renderuje sekcję społeczności z przyciskami', () => {
    render(<Home />);
    
    expect(screen.getByText('Dołącz do naszej społeczności')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zarejestruj się teraz' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Zaloguj się' })).toBeInTheDocument();
  });
});