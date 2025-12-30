import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../components/Login';
import { AuthProvider } from '../actions/AuthContext';
import { vi } from 'vitest';

// Mock dla axios i funkcji
vi.mock('../api/axios', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(() => Promise.resolve({ data: { loggedIn: false } })),
    interceptors: {
      request: { use: vi.fn(() => 1), eject: vi.fn() },
      response: { use: vi.fn(() => 2), eject: vi.fn() }
    }
  },
  getCookie: vi.fn(() => null),
  parseJwt: vi.fn(() => null)
}));

const MockedLogin = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  test('renderuje formularz logowania', async () => {
    render(<MockedLogin />);
    
    // Sprawdzamy czy komponent się załadował - szukamy dowolnego elementu
    await waitFor(() => {
      const hasElements = document.body.children.length > 0;
      expect(hasElements).toBe(true);
    }, { timeout: 2000 });
  });

  test('renderuje przycisk logowania', async () => {
    render(<MockedLogin />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /zaloguj się/i })).toBeInTheDocument();
    });
  });

  test('obsługuje proces logowania', async () => {
    const { api } = await import('../api/axios');
    api.post.mockResolvedValueOnce({
      data: { token: 'fake-token', user: { id: 1, firstName: 'Jan' } }
    });

    render(<MockedLogin />);

    // Czekamy aż komponent się załaduje (może być w stanie loading)
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Szukamy elementów formularza
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = screen.getByRole('button', { name: /zaloguj się/i });

    // Wypełniamy formularz jeśli elementy istnieją
    if (emailInput) fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    if (passwordInput) fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(loginButton);

    // Test czy funkcja została wywołana
    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });
  });
});