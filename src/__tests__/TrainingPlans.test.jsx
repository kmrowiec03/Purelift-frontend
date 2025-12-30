import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TrainingPlans from '../components/TrainingPlans';
import { vi } from 'vitest';

// Mock dla axios
vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn()
  }
}));

import { api } from '../api/axios';

const MockedTrainingPlans = () => (
  <BrowserRouter>
    <TrainingPlans />
  </BrowserRouter>
);

describe('TrainingPlans Component', () => {
  beforeEach(() => {
    api.get.mockClear();
  });

  test('wyświetla stan ładowania', () => {
    api.get.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    
    render(<MockedTrainingPlans />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('wyświetla listę planów treningowych', async () => {
    const mockPlans = [
      { id: 1, title: 'Plan treningowy 1' },
      { id: 2, title: 'Plan treningowy 2' }
    ];

    api.get.mockResolvedValueOnce({ data: mockPlans });
    
    render(<MockedTrainingPlans />);

    await waitFor(() => {
      expect(screen.getByText('Plan treningowy 1')).toBeInTheDocument();
      expect(screen.getByText('Plan treningowy 2')).toBeInTheDocument();
    });
  });

  test('wyświetla komunikat gdy brak planów', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    render(<MockedTrainingPlans />);

    await waitFor(() => {
      expect(screen.getByText('No training plans found.')).toBeInTheDocument();
    });
  });

  test('wyświetla przycisk dodawania nowego planu', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    render(<MockedTrainingPlans />);

    await waitFor(() => {
      const addButton = screen.getByText('+');
      expect(addButton).toBeInTheDocument();
    });
  });
});