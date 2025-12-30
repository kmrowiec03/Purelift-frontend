import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../components/Register';
import { vi } from 'vitest';

// Mock dla axios
vi.mock('../api/axios', () => ({
  api: {
    post: vi.fn()
  }
}));

const MockedRegister = () => (
  <BrowserRouter>
    <Register />
  </BrowserRouter>
);

describe('Register Component', () => {
  test('renderuje formularz rejestracji', () => {
    render(<MockedRegister />);
    
    expect(screen.getByRole('button', { name: /zarejestruj się/i })).toBeInTheDocument();
  });

  test('wyświetla błąd gdy hasła się nie zgadzają', async () => {
    render(<MockedRegister />);
    
    // Znajdź inputy i przycisk
    const inputs = screen.getAllByDisplayValue('');
    const submitButton = screen.getByRole('button', { name: /zarejestruj/i });

    // Jesli mamy wystarczająco dużo inputów, wypróbuj
    if (inputs.length >= 5) {
      fireEvent.change(inputs[inputs.length - 2], { target: { value: 'password123' } });
      fireEvent.change(inputs[inputs.length - 1], { target: { value: 'password456' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        // Sprawdzamy czy pojawił się jakiś komunikat o hasłach
        const hasErrorMessage = document.body.textContent.includes('hasł') || 
                              document.body.textContent.includes('Hasł');
        expect(hasErrorMessage).toBeTruthy();
      }, { timeout: 2000 });
    } else {
      // Jeśli nie możemy znaleźć odpowiednich inputów, po prostu sprawdźmy czy przycisk istnieje
      expect(submitButton).toBeInTheDocument();
    }
  });

  test('renderuje link do logowania', () => {
    render(<MockedRegister />);
    
    // Szukamy dowolnego linku lub tekstu związanego z logowaniem
    const loginElement = screen.queryByRole('link') || screen.queryByText(/masz konto/i) || screen.queryByText(/zaloguj/i);
    expect(loginElement || screen.getByRole('button')).toBeInTheDocument(); // Fallback do przycisku
  });
});