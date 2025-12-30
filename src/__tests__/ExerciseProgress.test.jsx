import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ExerciseProgress from '../components/ExerciseProgress';
import { AuthContext } from '../actions/AuthContext';
import { vi } from 'vitest';

// Mock dla axios
vi.mock('../api/axios', () => ({
  api: {
    get: vi.fn()
  }
}));

// Mock dla recharts
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>
}));

import { api } from '../api/axios';

const MockedExerciseProgress = ({ authValue }) => (
  <AuthContext.Provider value={authValue}>
    <ExerciseProgress />
  </AuthContext.Provider>
);

describe('ExerciseProgress Component', () => {
  const mockUser = { id: 1, role: 'ROLE_USER' };
  const mockAuthValue = { user: mockUser };

  beforeEach(() => {
    api.get.mockClear();
    // Wyciszamy console.error dla testów
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test('ładuje listę ćwiczeń dla zalogowanego użytkownika', async () => {
    const mockExercises = [
      { id: 1, name: 'Wyciskanie sztangi' },
      { id: 2, name: 'Martwy ciąg' }
    ];

    const mockMetrics = [
      { exerciseId: 1, weight: 80, date: '2024-01-01' },
      { exerciseId: 1, weight: 85, date: '2024-01-15' }
    ];

    api.get
      .mockResolvedValueOnce({ data: mockExercises })
      .mockResolvedValueOnce({ data: mockMetrics });
    
    render(<MockedExerciseProgress authValue={mockAuthValue} />);

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/metrics/recent-exercises', { withCredentials: true });
    });

    // Test wyboru ćwiczenia
    await waitFor(() => {
      expect(screen.getByText('Wyciskanie sztangi')).toBeInTheDocument();
    });
  });

  test('wyświetla błąd gdy nie można pobrać ćwiczeń', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(<MockedExerciseProgress authValue={mockAuthValue} />);

    await waitFor(() => {
      expect(screen.getByText('Nie udało się pobrać listy ćwiczeń.')).toBeInTheDocument();
    });
  });

  test('nie ładuje danych gdy brak użytkownika', () => {
    const noUserAuth = { user: null };
    
    render(<MockedExerciseProgress authValue={noUserAuth} />);

    expect(api.get).not.toHaveBeenCalled();
  });
});