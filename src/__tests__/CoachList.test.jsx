import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import CoachList from '../components/CoachList';
import { AuthContext } from '../actions/AuthContext';
import { vi } from 'vitest';

// Mock dla axios
vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn()
  }
}));

import { api } from '../api/axios';

const MockedCoachList = ({ authValue }) => (
  <AuthContext.Provider value={authValue}>
    <CoachList />
  </AuthContext.Provider>
);

describe('CoachList Component', () => {
  const mockAuthValue = {
    isLoggedIn: true,
    user: { id: 1, role: 'ROLE_USER' }
  };

  beforeEach(() => {
    api.get.mockClear();
    api.post.mockClear();
  });

  test('wyświetla stan ładowania', () => {
    api.get.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<MockedCoachList authValue={mockAuthValue} />);
    
    expect(screen.getByText('Ładowanie trenerów...')).toBeInTheDocument();
  });

  test('wyświetla listę trenerów', async () => {
    const mockCoaches = [
      { 
        id: 1, 
        firstName: 'Jan', 
        lastName: 'Kowalski', 
        description: 'Doświadczony trener', 
        hourlyRate: 50 
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockCoaches });
    
    render(<MockedCoachList authValue={mockAuthValue} />);

    await waitFor(() => {
      expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    });
  });

  test('wyświetla błąd gdy nie można pobrać trenerów', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(<MockedCoachList authValue={mockAuthValue} />);

    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać listy trenerów.')).toBeInTheDocument();
    });
  });

  test('wyświetla komunikat dla niezalogowanych użytkowników', async () => {
    const unauthenticatedUser = { isLoggedIn: false, user: null };
    api.get.mockResolvedValueOnce({ data: [] });
    
    render(<MockedCoachList authValue={unauthenticatedUser} />);

    await waitFor(() => {
      expect(screen.getByText('Brak dostępnych trenerów.')).toBeInTheDocument();
    });
  });

  test('umożliwia wybór trenera dla zalogowanego użytkownika', async () => {
    const mockCoaches = [
      { 
        id: 1, 
        firstName: 'Anna', 
        lastName: 'Nowak', 
        description: 'Specjalista od siłowni', 
        hourlyRate: 60 
      },
      { 
        id: 2, 
        firstName: 'Michał', 
        lastName: 'Zieliński', 
        description: 'Trener personalny', 
        hourlyRate: 70 
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockCoaches });
    api.post.mockResolvedValueOnce({ data: { success: true } });
    
    render(<MockedCoachList authValue={mockAuthValue} />);

    // Czekamy na załadowanie listy trenerów
    await waitFor(() => {
      expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
      expect(screen.getByText('Michał Zieliński')).toBeInTheDocument();
    });

    // Sprawdzamy czy są przyciski "Poproś o plan"
    const requestButtons = screen.getAllByText('Poproś o plan');
    fireEvent.click(requestButtons[0]);

    // Czekamy na pojawienie się formularza
    await waitFor(() => {
      expect(screen.getByText('Wyślij prośbę o plan')).toBeInTheDocument();
    });

    // Wypełniamy i wysyłamy formularz
    const textarea = screen.getByPlaceholderText(/Opisz wymagania/);
    const sendButton = screen.getByText('Wyślij prośbę o plan');
    
    fireEvent.change(textarea, { target: { value: 'Chcę trenować siłę' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});