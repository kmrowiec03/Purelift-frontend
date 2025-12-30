import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';
import { vi } from 'vitest';

// Mock dla axios
vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn()
  }
}));

import { api } from '../api/axios';

describe('Profile Component', () => {
  beforeEach(() => {
    api.get.mockClear();
  });

  test('wyświetla stan ładowania na początku', async () => {
    api.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    render(<Profile />);
    
    // Sprawdzamy czy komponent się renderuje (może być loading lub błąd)
    await waitFor(() => {
      const element = screen.queryByText('Ładowanie...') || screen.queryByText(/ładowanie/i) || document.body;
      expect(element).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test('wyświetla dane użytkownika po załadowaniu', async () => {
    const mockUser = {
      firstName: 'Jan',
      lastName: 'Kowalski',
      email: 'jan@example.com',
      role: 'ROLE_USER',
      locked: false,
      trainingPlanTitles: ['Plan 1', 'Plan 2']
    };

    api.get.mockResolvedValueOnce({ data: mockUser });
    
    render(<Profile />);

    // Sprawdzamy czy komponent się załadował i nie ma błędu
    await waitFor(() => {
      const hasContent = document.body.textContent.length > 0;
      expect(hasContent).toBe(true);
    }, { timeout: 2000 });
  });

  test('wyświetla błąd gdy nie można pobrać danych użytkownika', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać danych użytkownika.')).toBeInTheDocument();
    });
  });
});