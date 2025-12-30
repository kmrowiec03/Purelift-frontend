import { getCookie, parseJwt } from '../api/axios';
import { vi } from 'vitest';

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: ''
});

// Mock atob function
global.atob = vi.fn();

describe('API Helpers', () => {
  beforeEach(() => {
    document.cookie = '';
    global.atob.mockClear();
  });

  describe('getCookie', () => {
    test('zwraca wartość ciasteczka gdy istnieje', () => {
      document.cookie = 'accessToken=abc123; Path=/';
      
      const result = getCookie('accessToken');
      
      expect(result).toBe('abc123');
    });

    test('zwraca null gdy ciasteczko nie istnieje', () => {
      document.cookie = 'otherCookie=value123';
      
      const result = getCookie('accessToken');
      
      expect(result).toBeNull();
    });

    test('dekoduje zakodowane wartości ciasteczek', () => {
      document.cookie = 'accessToken=hello%20world; Path=/';
      
      const result = getCookie('accessToken');
      
      expect(result).toBe('hello world');
    });
  });

  describe('parseJwt', () => {
    test('parsuje poprawny token JWT', () => {
      const mockPayload = { userId: 123, role: 'ROLE_USER' };
      const encodedPayload = btoa(JSON.stringify(mockPayload));
      const token = `header.${encodedPayload}.signature`;
      
      global.atob.mockReturnValueOnce(JSON.stringify(mockPayload));
      
      const result = parseJwt(token);
      
      expect(result).toEqual(mockPayload);
      expect(global.atob).toHaveBeenCalledWith(encodedPayload);
    });

    test('zwraca null dla pustego tokenu', () => {
      const result = parseJwt('');
      
      expect(result).toBeNull();
    });

    test('zwraca null dla niepoprawnego tokenu', () => {
      global.atob.mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });
      
      const result = parseJwt('invalid.token.format');
      
      expect(result).toBeNull();
    });

    test('zwraca null dla null tokenu', () => {
      const result = parseJwt(null);
      
      expect(result).toBeNull();
    });
  });
});