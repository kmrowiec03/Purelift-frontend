import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, AuthContext } from '../actions/AuthContext';
import { vi } from 'vitest';

// Mock dla axios
vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ data: { loggedIn: false } })),
    interceptors: {
      request: {
        use: vi.fn(() => 1),
        eject: vi.fn()
      },
      response: {
        use: vi.fn(() => 2),
        eject: vi.fn()
      }
    }
  },
  getCookie: vi.fn(() => null),
  parseJwt: vi.fn(() => null)
}));

const TestComponent = () => {
  const authContext = React.useContext(AuthContext);
  
  if (!authContext) return <div>No Auth Context</div>;
  
  return (
    <div>
      <div data-testid="isLoggedIn">{authContext.isLoggedIn ? 'logged in' : 'not logged in'}</div>
      <div data-testid="loading">{authContext.loading ? 'loading' : 'not loading'}</div>
    </div>
  );
};

describe('AuthContext', () => {
  test('udostępnia początkowy stan uwierzytelnienia', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('not logged in');
    });
  });

  test('wyświetla komunikat braku kontekstu poza providerem', () => {
    render(<TestComponent />);
    
    expect(screen.getByText('No Auth Context')).toBeInTheDocument();
  });

  test('testuje zalogowanego użytkownika', async () => {
    const { api } = await import('../api/axios');
    api.get.mockResolvedValueOnce({ 
      data: { 
        loggedIn: true, 
        user: { id: 1, firstName: 'Jan', lastName: 'Kowalski', role: 'ROLE_USER' } 
      } 
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('logged in');
    });
  });

  test('obsługuje błąd serwera podczas logowania', async () => {
    const { api } = await import('../api/axios');
    api.get.mockRejectedValueOnce(new Error('Network Error'));

    render(
        <BrowserRouter>
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
        </BrowserRouter>
    );

    await waitFor(() => {
        expect(screen.getByTestId('isLoggedIn')).toHaveTextContent('not logged in');
    });
    });
});